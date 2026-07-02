import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { ProductsModule } from '@/modules/products/products.module';
import { ScansController } from './scans.controller';
import { ScansService } from './scans.service';

@Module({
    imports: [PrismaModule, ProductsModule],
    controllers: [ScansController],
    providers: [ScansService],
    exports: [ScansService],
})
export class ScansModule {}
