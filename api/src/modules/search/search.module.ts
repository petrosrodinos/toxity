import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { ProductsModule } from '@/modules/products/products.module';
import { IngredientsModule } from '@/modules/ingredients/ingredients.module';
import { BrandsModule } from '@/modules/brands/brands.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
    imports: [PrismaModule, ProductsModule, IngredientsModule, BrandsModule],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule {}
