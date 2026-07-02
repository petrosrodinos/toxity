import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AiIntegrationModule } from '@/integrations/ai/ai.module';
import { ProductCreationModule } from '@/modules/product-creation/product-creation.module';
import { AdminReanalysisController } from './controllers/admin-reanalysis.controller';
import { ReanalysisService } from './services/reanalysis.service';
import { ProductReanalysisRunner } from './services/product-reanalysis.runner';
import { IngredientReanalysisRunner } from './services/ingredient-reanalysis.runner';

@Module({
    imports: [PrismaModule, AiIntegrationModule, ProductCreationModule],
    controllers: [AdminReanalysisController],
    providers: [
        ReanalysisService,
        ProductReanalysisRunner,
        IngredientReanalysisRunner,
    ],
})
export class ReanalysisModule {}
