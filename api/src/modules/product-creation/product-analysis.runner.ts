import { Injectable, Logger } from '@nestjs/common';
import { Prisma, ProductCreationJobStatus, ScanMethod } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OcrResult } from '@/integrations/ocr/interfaces/ocr.interfaces';
import {
    PRODUCT_ANALYSIS_AI_VERSION,
    ProductAnalysisResult,
} from '@/integrations/ai/prompts/product-analysis';
import {
    ProductAnalysisResolverService,
    TransactionClient,
} from './product-analysis-resolver.service';

@Injectable()
export class ProductAnalysisRunner {
    private readonly logger = new Logger(ProductAnalysisRunner.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly resolver: ProductAnalysisResolverService,
    ) {}

    async run(job_uuid: string): Promise<void> {
        try {
            const job = await this.prisma.productCreationJob.findUniqueOrThrow(
                { where: { uuid: job_uuid } },
            );

            if (job.status !== ProductCreationJobStatus.ANALYZING) {
                return;
            }

            const ocr_result = job.ocr_result as unknown as OcrResult;
            const analysis = await this.resolver.generateAnalysis(
                ocr_result,
                job.barcode,
            );

            const product_uuid = await this.prisma.$transaction((tx) =>
                this.persistAnalysis(tx, {
                    job_uuid: job.uuid,
                    user_uuid: job.user_uuid,
                    barcode: job.barcode,
                    front_label_image_url: job.front_label_image_url,
                    ingredient_label_image_url: job.ingredient_label_image_url,
                    ocr_result,
                    analysis,
                }),
            );

            await this.prisma.productCreationJob.update({
                where: { uuid: job_uuid },
                data: {
                    status: ProductCreationJobStatus.COMPLETED,
                    product_uuid,
                    error_message: null,
                },
            });
        } catch (error) {
            this.logger.error(
                `Product analysis failed for job ${job_uuid}: ${error.message}`,
                error.stack,
            );

            try {
                await this.prisma.productCreationJob.update({
                    where: { uuid: job_uuid },
                    data: {
                        status: ProductCreationJobStatus.FAILED,
                        error_message:
                            'AI analysis could not complete. Please try again.',
                    },
                });
            } catch (update_error) {
                this.logger.error(
                    `Failed to mark job ${job_uuid} as FAILED: ${update_error.message}`,
                );
            }
        }
    }

    private async persistAnalysis(
        tx: TransactionClient,
        input: {
            job_uuid: string;
            user_uuid: string;
            barcode: string | null;
            front_label_image_url: string | null;
            ingredient_label_image_url: string | null;
            ocr_result: OcrResult;
            analysis: ProductAnalysisResult;
        },
    ): Promise<string> {
        const { analysis } = input;

        const brand_uuid = await this.resolver.resolveBrand(tx, analysis);
        const subcategory_uuid = await this.resolver.resolveSubcategory(
            tx,
            analysis,
        );
        const ingredient_uuids = await this.resolver.resolveIngredients(
            tx,
            analysis.ingredients,
        );

        const product = await tx.product.create({
            data: {
                barcode: input.barcode,
                name: analysis.product_name.trim(),
                brand_uuid,
                subcategory_uuid,
                description: analysis.description,
                ai_summary: analysis.ai_summary,
                benefits: analysis.benefits,
                risks: analysis.risks,
                warnings: analysis.warnings,
                suitability: analysis.suitability,
                recommended_usage: analysis.recommended_usage,
                storage_info: analysis.storage_info,
                pregnancy_safety: analysis.pregnancy_safety,
                children_safety: analysis.children_safety,
                sensitive_skin_safety: analysis.sensitive_skin_safety,
                allergy_warnings: analysis.allergy_warnings,
                environmental_impact: analysis.environmental_impact,
                is_vegan: analysis.is_vegan,
                is_cruelty_free: analysis.is_cruelty_free,
                overall_score: analysis.overall_score,
                color_indicator: analysis.color_indicator,
                scientific_confidence: analysis.scientific_confidence,
                marketing_claims: input.ocr_result.claims,
                package_size: analysis.package_size,
                verification_status: 'APPROVED',
                scan_count: 1,
                ai_version: PRODUCT_ANALYSIS_AI_VERSION,
                faq: analysis.faq
                    ? (analysis.faq as unknown as Prisma.InputJsonValue)
                    : Prisma.JsonNull,
            },
        });

        await tx.productIngredient.createMany({
            data: ingredient_uuids.map((ingredient_uuid, index) => ({
                product_uuid: product.uuid,
                ingredient_uuid,
                position: index,
            })),
        });

        const images: { url: string; type: 'HERO' | 'INGREDIENT_LABEL' }[] =
            [];

        if (input.front_label_image_url) {
            images.push({
                url: input.front_label_image_url,
                type: 'HERO',
            });
        }

        if (input.ingredient_label_image_url) {
            images.push({
                url: input.ingredient_label_image_url,
                type: 'INGREDIENT_LABEL',
            });
        }

        if (images.length > 0) {
            await tx.productImage.createMany({
                data: images.map((image, index) => ({
                    product_uuid: product.uuid,
                    url: image.url,
                    type: image.type,
                    sort_order: index,
                })),
            });
        }

        await tx.userProductScan.upsert({
            where: {
                user_uuid_product_uuid: {
                    user_uuid: input.user_uuid,
                    product_uuid: product.uuid,
                },
            },
            create: {
                user_uuid: input.user_uuid,
                product_uuid: product.uuid,
                scan_method: ScanMethod.OCR,
            },
            update: {
                scanned_at: new Date(),
                scan_method: ScanMethod.OCR,
            },
        });

        return product.uuid;
    }
}
