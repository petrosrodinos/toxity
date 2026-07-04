import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { GcsIntegrationModule } from '@/integrations/storage/gcs/gcs.module';
import { OcrModule } from '@/integrations/ocr/ocr.module';
import { AiIntegrationModule } from '@/integrations/ai/ai.module';
import { ProductsModule } from '@/modules/products/products.module';
import { ProductCreationController } from './product-creation.controller';
import { ProductCreationService } from './product-creation.service';
import { ProductAnalysisRunner } from './product-analysis.runner';
import { ProductAnalysisResolverService } from './product-analysis-resolver.service';

@Module({
    imports: [
        PrismaModule,
        GcsIntegrationModule,
        OcrModule,
        AiIntegrationModule,
        ProductsModule,
    ],
    controllers: [ProductCreationController],
    providers: [
        ProductCreationService,
        ProductAnalysisRunner,
        ProductAnalysisResolverService,
    ],
    exports: [ProductCreationService, ProductAnalysisResolverService],
})
export class ProductCreationModule {}
