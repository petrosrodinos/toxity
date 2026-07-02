import { ApiProperty } from '@nestjs/swagger';
import { ProductListItemEntity } from '@/modules/products/entities/product.entity';
import { IngredientListItemEntity } from '@/modules/ingredients/entities/ingredient.entity';
import { BrandEntity } from '@/modules/brands/entities/brand.entity';

export class SearchPaginationEntity {
    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    total_pages: number;

    @ApiProperty()
    has_next: boolean;

    @ApiProperty()
    has_prev: boolean;
}

export class SearchProductsEntity {
    @ApiProperty({ type: [ProductListItemEntity] })
    data: ProductListItemEntity[];

    @ApiProperty({ type: SearchPaginationEntity })
    pagination: SearchPaginationEntity;
}

export class SearchIngredientsEntity {
    @ApiProperty({ type: [IngredientListItemEntity] })
    data: IngredientListItemEntity[];

    @ApiProperty({ type: SearchPaginationEntity })
    pagination: SearchPaginationEntity;
}

export class SearchBrandsEntity {
    @ApiProperty({ type: [BrandEntity] })
    data: BrandEntity[];

    @ApiProperty({ type: SearchPaginationEntity })
    pagination: SearchPaginationEntity;
}

export class SearchResultEntity {
    @ApiProperty({ type: SearchProductsEntity })
    products: SearchProductsEntity;

    @ApiProperty({ type: SearchIngredientsEntity })
    ingredients: SearchIngredientsEntity;

    @ApiProperty({ type: SearchBrandsEntity })
    brands: SearchBrandsEntity;
}
