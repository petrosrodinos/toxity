import { Module } from '@nestjs/common';
import { IngredientsController } from './ingredients.controller';
import { AdminIngredientsController } from './admin-ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [IngredientsController, AdminIngredientsController],
    providers: [IngredientsService],
    exports: [IngredientsService],
})
export class IngredientsModule {}
