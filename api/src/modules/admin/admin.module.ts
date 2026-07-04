import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { ProductsModule } from '@/modules/products/products.module';
import { GcsIntegrationModule } from '@/integrations/storage/gcs/gcs.module';
import { AdminProductsController } from './controllers/admin-products.controller';
import { AdminIngredientsMergeController } from './controllers/admin-ingredients-merge.controller';
import { AdminBrandsController } from './controllers/admin-brands.controller';
import { AdminCategoriesController } from './controllers/admin-categories.controller';
import { AdminSubcategoriesController } from './controllers/admin-subcategories.controller';
import { AdminModerationService } from './services/admin-moderation.service';
import { AdminTaxonomyService } from './services/admin-taxonomy.service';

@Module({
    imports: [PrismaModule, ProductsModule, GcsIntegrationModule],
    controllers: [
        AdminProductsController,
        AdminIngredientsMergeController,
        AdminBrandsController,
        AdminCategoriesController,
        AdminSubcategoriesController,
    ],
    providers: [AdminModerationService, AdminTaxonomyService],
})
export class AdminModule {}
