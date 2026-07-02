import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FavoriteEntityType } from 'generated/prisma';
import { ProductListItemEntity } from '@/modules/products/entities/product.entity';
import { IngredientListItemEntity } from '@/modules/ingredients/entities/ingredient.entity';
import { BrandEntity } from '@/modules/brands/entities/brand.entity';

export class FavoriteEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty({ enum: FavoriteEntityType })
    entity_type: FavoriteEntityType;

    @ApiProperty()
    entity_uuid: string;

    @ApiProperty()
    created_at: Date;

    @ApiPropertyOptional({ type: ProductListItemEntity, nullable: true })
    product: ProductListItemEntity | null;

    @ApiPropertyOptional({ type: IngredientListItemEntity, nullable: true })
    ingredient: IngredientListItemEntity | null;

    @ApiPropertyOptional({ type: BrandEntity, nullable: true })
    brand: BrandEntity | null;
}

export class FavoriteCheckEntity {
    @ApiProperty()
    is_favorited: boolean;

    @ApiPropertyOptional({ nullable: true })
    favorite_uuid: string | null;
}
