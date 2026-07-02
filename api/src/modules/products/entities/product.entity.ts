import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    ColorIndicator,
    ProductImageType,
    SafetyLevel,
    VerificationStatus,
} from 'generated/prisma';
import { IngredientEntity } from '@/modules/ingredients/entities/ingredient.entity';

export class ProductBrandEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    logo_url: string | null;
}

export class ProductCategoryEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty()
    name: string;
}

export class ProductSubcategoryEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ type: ProductCategoryEntity })
    category: ProductCategoryEntity;
}

export class ProductImageEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty()
    url: string;

    @ApiProperty({ enum: ProductImageType })
    type: ProductImageType;

    @ApiProperty()
    sort_order: number;
}

export class ProductIngredientItemEntity {
    @ApiProperty()
    position: number;

    @ApiProperty({ type: IngredientEntity })
    ingredient: IngredientEntity;
}

export class ProductFaqItemEntity {
    @ApiProperty()
    question: string;

    @ApiProperty()
    answer: string;
}

export class ProductListItemEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    barcode: string | null;

    @ApiProperty()
    overall_score: string;

    @ApiProperty({ enum: ColorIndicator })
    color_indicator: ColorIndicator;

    @ApiProperty()
    is_featured: boolean;

    @ApiProperty()
    scan_count: number;

    @ApiPropertyOptional()
    package_size: string | null;

    @ApiProperty({ type: ProductBrandEntity })
    brand: ProductBrandEntity;

    @ApiPropertyOptional()
    hero_image_url: string | null;
}

export class ProductDetailEntity extends ProductListItemEntity {
    @ApiProperty({ type: ProductSubcategoryEntity })
    subcategory: ProductSubcategoryEntity;

    @ApiPropertyOptional()
    description: string | null;

    @ApiPropertyOptional()
    ai_summary: string | null;

    @ApiPropertyOptional()
    benefits: string | null;

    @ApiPropertyOptional()
    risks: string | null;

    @ApiPropertyOptional()
    warnings: string | null;

    @ApiPropertyOptional()
    suitability: string | null;

    @ApiPropertyOptional()
    recommended_usage: string | null;

    @ApiPropertyOptional()
    storage_info: string | null;

    @ApiPropertyOptional({ enum: SafetyLevel })
    pregnancy_safety: SafetyLevel | null;

    @ApiPropertyOptional({ enum: SafetyLevel })
    children_safety: SafetyLevel | null;

    @ApiPropertyOptional({ enum: SafetyLevel })
    sensitive_skin_safety: SafetyLevel | null;

    @ApiPropertyOptional()
    allergy_warnings: string | null;

    @ApiPropertyOptional()
    environmental_impact: string | null;

    @ApiPropertyOptional()
    is_vegan: boolean | null;

    @ApiPropertyOptional()
    is_cruelty_free: boolean | null;

    @ApiPropertyOptional()
    scientific_confidence: string | null;

    @ApiProperty({ type: [String] })
    marketing_claims: string[];

    @ApiProperty({ enum: VerificationStatus })
    verification_status: VerificationStatus;

    @ApiProperty({ type: [ProductImageEntity] })
    images: ProductImageEntity[];

    @ApiProperty({ type: [ProductIngredientItemEntity] })
    ingredients: ProductIngredientItemEntity[];

    @ApiPropertyOptional({ type: [ProductFaqItemEntity] })
    faq: ProductFaqItemEntity[] | null;

    @ApiProperty()
    is_favorited: boolean;
}
