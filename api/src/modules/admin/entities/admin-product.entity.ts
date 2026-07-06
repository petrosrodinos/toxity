import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ColorIndicator } from 'generated/prisma';
import { ProductBrandEntity } from '@/modules/products/entities/product.entity';

export class AdminProductIngredientEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ enum: ColorIndicator })
    color_indicator: ColorIndicator;

    @ApiProperty()
    position: number;
}

export class AdminProductListItemEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    barcode: string | null;

    @ApiPropertyOptional()
    package_size: string | null;

    @ApiProperty()
    overall_score: string;

    @ApiProperty({ enum: ColorIndicator })
    color_indicator: ColorIndicator;

    @ApiProperty()
    is_featured: boolean;

    @ApiProperty()
    scan_count: number;

    @ApiProperty({ type: ProductBrandEntity })
    brand: ProductBrandEntity;

    @ApiProperty({ type: [AdminProductIngredientEntity] })
    ingredients: AdminProductIngredientEntity[];
}
