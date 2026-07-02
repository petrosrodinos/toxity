import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IngredientEntity } from '@/modules/ingredients/entities/ingredient.entity';
import { ProductListItemEntity } from '@/modules/products/entities/product.entity';

export class HomeCategoryEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    slug: string;

    @ApiPropertyOptional()
    icon_url: string | null;
}

export class IngredientSpotlightEntity {
    @ApiProperty({ type: IngredientEntity })
    ingredient: IngredientEntity;
}

export class DailyTipEntity {
    @ApiProperty()
    title: string;

    @ApiProperty()
    body: string;
}

export class HomeFeedEntity {
    @ApiProperty({ type: [ProductListItemEntity] })
    continue_scanning: ProductListItemEntity[];

    @ApiProperty({ type: [ProductListItemEntity] })
    recently_scanned: ProductListItemEntity[];

    @ApiProperty({ type: [ProductListItemEntity] })
    trending: ProductListItemEntity[];

    @ApiProperty({ type: [ProductListItemEntity] })
    highest_rated: ProductListItemEntity[];

    @ApiProperty({ type: [ProductListItemEntity] })
    new_products: ProductListItemEntity[];

    @ApiProperty({ type: [ProductListItemEntity] })
    recommended: ProductListItemEntity[];

    @ApiProperty({ type: [HomeCategoryEntity] })
    categories: HomeCategoryEntity[];

    @ApiPropertyOptional({ type: IngredientSpotlightEntity, nullable: true })
    ingredient_spotlight: IngredientSpotlightEntity | null;

    @ApiProperty({ type: DailyTipEntity })
    daily_tip: DailyTipEntity;
}
