import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AppCacheModule } from '@/shared/services/cache/cache.module';
import { ProductsModule } from '@/modules/products/products.module';
import { IngredientsModule } from '@/modules/ingredients/ingredients.module';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
    imports: [PrismaModule, AppCacheModule, ProductsModule, IngredientsModule],
    controllers: [HomeController],
    providers: [HomeService],
})
export class HomeModule {}
