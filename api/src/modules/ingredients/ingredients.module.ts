import { Module } from '@nestjs/common';
import { IngredientsController } from './ingredients.controller';
import { AdminIngredientsController } from './admin-ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { FavoritesModule } from '@/modules/favorites/favorites.module';

@Module({
    imports: [PrismaModule, FavoritesModule],
    controllers: [IngredientsController, AdminIngredientsController],
    providers: [IngredientsService],
    exports: [IngredientsService],
})
export class IngredientsModule {}
