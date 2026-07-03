import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { OcrService } from '@/integrations/ocr/services/ocr.service';
import { VisionConfig } from '@/integrations/ocr/config/vision.config';
import { CreateProductCreationJobDto } from './dto/create-product-creation-job.dto';
import { ProductCreationJobEntity } from './entities/product-creation-job.entity';
import { OcrResult } from '@/integrations/ocr/interfaces/ocr.interfaces';
import {
    extract_claims_from_text,
    parse_front_label_text,
    parse_ingredients_from_text,
} from './utils/parse-label-text.utils';
import { ProductCreationJobStatus, Prisma } from 'generated/prisma';

const ALLOWED_IMAGE_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
]);

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

const GCS_PRODUCT_CREATION_FOLDER = 'product-creation';

@Injectable()
export class ProductCreationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly gcs_service: GcsService,
        private readonly ocr_service: OcrService,
        private readonly vision_config: VisionConfig,
    ) {}

    async create_job(
        user_uuid: string,
        dto: CreateProductCreationJobDto,
    ): Promise<ProductCreationJobEntity> {
        const job = await this.prisma.productCreationJob.create({
            data: {
                user_uuid,
                barcode: dto.barcode ?? null,
                status: ProductCreationJobStatus.PENDING,
            },
        });

        if (dto.barcode) {
            setImmediate(async () => {
                try {
                    await this.cleanup_previous_jobs_for_barcode(
                        user_uuid,
                        dto.barcode as string,
                        job.uuid,
                    );
                } catch {
                    // intentionally swallowed — cleanup must not affect creation
                }
            });
        }

        return this.to_entity(job);
    }

    private async cleanup_previous_jobs_for_barcode(
        user_uuid: string,
        barcode: string,
        current_job_uuid: string,
    ): Promise<void> {
        const previous_jobs = await this.prisma.productCreationJob.findMany({
            where: {
                user_uuid,
                barcode,
                uuid: { not: current_job_uuid },
                OR: [
                    { ingredient_label_image_url: { not: null } },
                    { front_label_image_url: { not: null } },
                ],
            },
        });

        for (const previous_job of previous_jobs) {
            await this.delete_job_label_images(previous_job);

            await this.prisma.productCreationJob.update({
                where: { uuid: previous_job.uuid },
                data: {
                    ingredient_label_image_url: null,
                    front_label_image_url: null,
                },
            });
        }
    }

    private async delete_job_label_images(job: {
        ingredient_label_image_url: string | null;
        front_label_image_url: string | null;
    }): Promise<void> {
        const urls = [
            job.ingredient_label_image_url,
            job.front_label_image_url,
        ].filter((url): url is string => !!url);

        await Promise.all(
            urls.map(async (url) => {
                try {
                    const path = this.extract_gcs_path_from_url(url);
                    await this.gcs_service.deleteImage({ filename: path });
                } catch {
                    // ignore missing/failed deletes for individual files
                }
            }),
        );
    }

    async upload_ingredient_label(
        user_uuid: string,
        job_uuid: string,
        file: Express.Multer.File,
    ): Promise<ProductCreationJobEntity> {
        const job = await this.find_owned_job(user_uuid, job_uuid);
        this.assert_job_pending(job);

        const url = await this.upload_label_image(
            file,
            job_uuid,
            'ingredient-label',
        );

        const updated = await this.prisma.productCreationJob.update({
            where: { uuid: job_uuid },
            data: { ingredient_label_image_url: url },
        });

        return this.to_entity(updated);
    }

    async upload_front_label(
        user_uuid: string,
        job_uuid: string,
        file: Express.Multer.File,
    ): Promise<ProductCreationJobEntity> {
        const job = await this.find_owned_job(user_uuid, job_uuid);
        this.assert_job_pending(job);

        const url = await this.upload_label_image(file, job_uuid, 'front-label');

        const updated = await this.prisma.productCreationJob.update({
            where: { uuid: job_uuid },
            data: { front_label_image_url: url },
        });

        return this.to_entity(updated);
    }

    async analyze(
        user_uuid: string,
        job_uuid: string,
    ): Promise<ProductCreationJobEntity> {
        const job = await this.find_owned_job(user_uuid, job_uuid);

        if (
            job.status !== ProductCreationJobStatus.PENDING &&
            job.status !== ProductCreationJobStatus.OCR &&
            job.status !== ProductCreationJobStatus.FAILED
        ) {
            throw new BadRequestException(
                'Job cannot be analyzed in its current state',
            );
        }

        if (!job.ingredient_label_image_url || !job.front_label_image_url) {
            throw new BadRequestException(
                'Both ingredient and front label images must be uploaded before analysis',
            );
        }

        if (!this.vision_config.is_configured()) {
            throw new UnprocessableEntityException(
                'OCR service is not configured. Please contact support.',
            );
        }

        await this.prisma.productCreationJob.update({
            where: { uuid: job_uuid },
            data: {
                status: ProductCreationJobStatus.OCR,
                error_message: null,
            },
        });

        try {
            const [ingredient_buffer, front_buffer] = await Promise.all([
                this.download_image_from_url(job.ingredient_label_image_url),
                this.download_image_from_url(job.front_label_image_url),
            ]);

            const [ingredient_ocr, front_ocr] = await Promise.all([
                this.ocr_service.extract_text({
                    image_buffer: ingredient_buffer,
                }),
                this.ocr_service.extract_text({ image_buffer: front_buffer }),
            ]);

            const ingredients = parse_ingredients_from_text(
                ingredient_ocr.raw_text,
            );

            if (ingredients.length === 0) {
                throw new UnprocessableEntityException(
                    'Could not read ingredients from the label photo. Please retake a clearer picture of the ingredient list.',
                );
            }

            const front_parsed = parse_front_label_text(front_ocr.raw_text);
            const claims = [
                ...extract_claims_from_text(ingredient_ocr.raw_text),
                ...extract_claims_from_text(front_ocr.raw_text),
            ];

            const ocr_result: OcrResult = {
                name: front_parsed.name,
                brand: front_parsed.brand,
                ingredients,
                claims: [...new Set(claims)],
            };

            const updated = await this.prisma.productCreationJob.update({
                where: { uuid: job_uuid },
                data: {
                    status: ProductCreationJobStatus.OCR,
                    ocr_result: ocr_result as unknown as Prisma.InputJsonValue,
                    error_message: null,
                },
            });

            return this.to_entity(updated);
        } catch (error) {
            const message =
                error instanceof UnprocessableEntityException
                    ? error.message
                    : 'Could not read text from the label photos. Please retake clearer pictures and try again.';

            const failed = await this.prisma.productCreationJob.update({
                where: { uuid: job_uuid },
                data: {
                    status: ProductCreationJobStatus.FAILED,
                    error_message: message,
                },
            });

            if (error instanceof UnprocessableEntityException) {
                throw error;
            }

            throw new UnprocessableEntityException(message, {
                cause: failed.uuid,
            });
        }
    }

    async find_one(
        user_uuid: string,
        job_uuid: string,
    ): Promise<ProductCreationJobEntity> {
        const job = await this.find_owned_job(user_uuid, job_uuid);
        return this.to_entity(job);
    }

    async start_analysis(
        user_uuid: string,
        job_uuid: string,
    ): Promise<ProductCreationJobEntity> {
        const job = await this.find_owned_job(user_uuid, job_uuid);

        if (job.status !== ProductCreationJobStatus.OCR || !job.ocr_result) {
            throw new BadRequestException(
                'Job must complete OCR before AI analysis can start',
            );
        }

        const updated = await this.prisma.productCreationJob.update({
            where: { uuid: job_uuid },
            data: {
                status: ProductCreationJobStatus.ANALYZING,
                error_message: null,
            },
        });

        return this.to_entity(updated);
    }

    private async find_owned_job(user_uuid: string, job_uuid: string) {
        const job = await this.prisma.productCreationJob.findFirst({
            where: { uuid: job_uuid, user_uuid },
        });

        if (!job) {
            throw new NotFoundException('Product creation job not found');
        }

        return job;
    }

    private assert_job_pending(job: { status: ProductCreationJobStatus }): void {
        if (job.status !== ProductCreationJobStatus.PENDING) {
            throw new BadRequestException(
                'Images can only be uploaded while the job is pending',
            );
        }
    }

    private validate_image_file(file: Express.Multer.File): void {
        if (!file?.buffer?.length) {
            throw new BadRequestException('Image file is required');
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            throw new BadRequestException(
                'Image file must be smaller than 10 MB',
            );
        }

        if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
            throw new BadRequestException(
                'Only JPEG, PNG, and WebP images are supported',
            );
        }
    }

    private async upload_label_image(
        file: Express.Multer.File,
        job_uuid: string,
        label_type: string,
    ): Promise<string> {
        this.validate_image_file(file);

        const extension = file.mimetype.split('/')[1] ?? 'jpg';
        const filename = `${job_uuid}-${label_type}.${extension}`;

        try {
            const upload = await this.gcs_service.uploadImageFromBuffer(
                file.buffer,
                filename,
                file.mimetype,
                GCS_PRODUCT_CREATION_FOLDER,
            );

            return upload.url;
        } catch {
            throw new UnprocessableEntityException(
                'Failed to upload image. Please try again.',
            );
        }
    }

    private async download_image_from_url(url: string): Promise<Buffer> {
        const path = this.extract_gcs_path_from_url(url);

        try {
            const download = await this.gcs_service.downloadImage({
                filename: path,
            });
            return download.buffer;
        } catch {
            throw new UnprocessableEntityException(
                'Failed to load uploaded label image for OCR processing',
            );
        }
    }

    private extract_gcs_path_from_url(url: string): string {
        const marker = '.googleapis.com/';
        const index = url.indexOf(marker);

        if (index === -1) {
            throw new UnprocessableEntityException('Invalid stored image URL');
        }

        const path_with_bucket = url.slice(index + marker.length);
        const slash_index = path_with_bucket.indexOf('/');

        if (slash_index === -1) {
            throw new UnprocessableEntityException('Invalid stored image URL');
        }

        return path_with_bucket.slice(slash_index + 1);
    }

    private to_entity(job: {
        uuid: string;
        status: ProductCreationJobStatus;
        barcode: string | null;
        ingredient_label_image_url: string | null;
        front_label_image_url: string | null;
        ocr_result: unknown;
        product_uuid: string | null;
        error_message: string | null;
        created_at: Date;
        updated_at: Date;
    }): ProductCreationJobEntity {
        return {
            uuid: job.uuid,
            status: job.status,
            barcode: job.barcode,
            ingredient_label_image_url: job.ingredient_label_image_url,
            front_label_image_url: job.front_label_image_url,
            ocr_result: (job.ocr_result as OcrResult | null) ?? null,
            product_uuid: job.product_uuid,
            error_message: job.error_message,
            created_at: job.created_at,
            updated_at: job.updated_at,
        };
    }
}
