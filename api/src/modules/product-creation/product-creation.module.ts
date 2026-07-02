import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { GcsIntegrationModule } from '@/integrations/storage/gcs/gcs.module';
import { OcrModule } from '@/integrations/ocr/ocr.module';
import { ProductCreationController } from './product-creation.controller';
import { ProductCreationService } from './product-creation.service';

@Module({
    imports: [PrismaModule, GcsIntegrationModule, OcrModule],
    controllers: [ProductCreationController],
    providers: [ProductCreationService],
    exports: [ProductCreationService],
})
export class ProductCreationModule {}
