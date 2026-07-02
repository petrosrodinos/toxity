import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { IngredientsModule } from '@/modules/ingredients/ingredients.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports: [PrismaModule, IngredientsModule],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {}
