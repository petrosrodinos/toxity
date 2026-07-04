import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { ProductCreationService } from './product-creation.service';
import { ProductAnalysisRunner } from './product-analysis.runner';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { CreateProductCreationJobDto } from './dto/create-product-creation-job.dto';
import { ProductCreationJobEntity } from './entities/product-creation-job.entity';
import { ProductCreationIdentifyEntity } from './entities/product-creation-identify.entity';

const image_upload_interceptor = FileInterceptor('image', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});

@ApiTags('Product Creation')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('product-creation')
export class ProductCreationController {
    constructor(
        private readonly product_creation_service: ProductCreationService,
        private readonly product_analysis_runner: ProductAnalysisRunner,
    ) {}

    @Post('jobs')
    @ApiOperation({ summary: 'Start a new product creation job' })
    @ApiResponse({ status: 201, type: ProductCreationJobEntity })
    create_job(
        @CurrentUser('uuid') user_uuid: string,
        @Body() dto: CreateProductCreationJobDto,
    ) {
        return this.product_creation_service.create_job(user_uuid, dto);
    }

    @Get('jobs/:uuid')
    @ApiOperation({ summary: 'Get product creation job status' })
    @ApiParam({ name: 'uuid', description: 'Product creation job UUID' })
    @ApiResponse({ status: 200, type: ProductCreationJobEntity })
    find_one(
        @CurrentUser('uuid') user_uuid: string,
        @Param('uuid') job_uuid: string,
    ) {
        return this.product_creation_service.find_one(user_uuid, job_uuid);
    }

    @Post('jobs/:uuid/ingredient-label')
    @UseInterceptors(image_upload_interceptor)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['image'],
            properties: {
                image: { type: 'string', format: 'binary' },
            },
        },
    })
    @ApiOperation({ summary: 'Upload ingredient label image' })
    @ApiParam({ name: 'uuid', description: 'Product creation job UUID' })
    @ApiResponse({ status: 200, type: ProductCreationJobEntity })
    upload_ingredient_label(
        @CurrentUser('uuid') user_uuid: string,
        @Param('uuid') job_uuid: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.product_creation_service.upload_ingredient_label(
            user_uuid,
            job_uuid,
            file,
        );
    }

    @Post('jobs/:uuid/front-label')
    @UseInterceptors(image_upload_interceptor)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['image'],
            properties: {
                image: { type: 'string', format: 'binary' },
            },
        },
    })
    @ApiOperation({ summary: 'Upload front label image' })
    @ApiParam({ name: 'uuid', description: 'Product creation job UUID' })
    @ApiResponse({ status: 200, type: ProductCreationJobEntity })
    upload_front_label(
        @CurrentUser('uuid') user_uuid: string,
        @Param('uuid') job_uuid: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.product_creation_service.upload_front_label(
            user_uuid,
            job_uuid,
            file,
        );
    }

    @Post('jobs/:uuid/identify')
    @ApiOperation({
        summary: 'Identify product from front label',
        description:
            'Runs OCR on the uploaded front label and checks whether a matching product already exists.',
    })
    @ApiParam({ name: 'uuid', description: 'Product creation job UUID' })
    @ApiResponse({ status: 200, type: ProductCreationIdentifyEntity })
    identify_from_front_label(
        @CurrentUser('uuid') user_uuid: string,
        @Param('uuid') job_uuid: string,
    ) {
        return this.product_creation_service.identify_from_front_label(
            user_uuid,
            job_uuid,
        );
    }

    @Post('jobs/:uuid/analyze')
    @ApiOperation({
        summary: 'Run OCR on uploaded label images',
        description:
            'Extracts product name, brand, ingredients, and claims from uploaded images. AI product creation is handled in a follow-up step.',
    })
    @ApiParam({ name: 'uuid', description: 'Product creation job UUID' })
    @ApiResponse({ status: 200, type: ProductCreationJobEntity })
    analyze(
        @CurrentUser('uuid') user_uuid: string,
        @Param('uuid') job_uuid: string,
    ) {
        return this.product_creation_service.analyze(user_uuid, job_uuid);
    }

    @Post('jobs/:uuid/start-analysis')
    @HttpCode(202)
    @ApiOperation({
        summary: 'Start AI product analysis',
        description:
            'Marks the job as ANALYZING and runs the AI analysis pipeline in-process. Poll GET /product-creation/jobs/:uuid for completion.',
    })
    @ApiParam({ name: 'uuid', description: 'Product creation job UUID' })
    @ApiResponse({ status: 202, type: ProductCreationJobEntity })
    async start_analysis(
        @CurrentUser('uuid') user_uuid: string,
        @Param('uuid') job_uuid: string,
    ) {
        const job = await this.product_creation_service.start_analysis(
            user_uuid,
            job_uuid,
        );

        setImmediate(() => {
            this.product_analysis_runner.run(job_uuid).catch(() => {
                // ProductAnalysisRunner.run already handles its own
                // failure state on the job; this catch only guards
                // against it rejecting unexpectedly.
            });
        });

        return job;
    }
}
