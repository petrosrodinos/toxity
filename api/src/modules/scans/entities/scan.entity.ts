import { ApiProperty } from '@nestjs/swagger';
import { ScanMethod } from 'generated/prisma';
import { ProductListItemEntity } from '@/modules/products/entities/product.entity';

export class ScanEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty()
    scanned_at: Date;

    @ApiProperty({ enum: ScanMethod })
    scan_method: ScanMethod;

    @ApiProperty({ type: ProductListItemEntity })
    product: ProductListItemEntity;
}
