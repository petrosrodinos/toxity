import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IngredientListItemEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    color_indicator: string;

    @ApiPropertyOptional()
    overall_score?: string | null;

    @ApiPropertyOptional()
    ai_summary?: string | null;

    @ApiPropertyOptional({ type: [String] })
    synonyms?: string[];
}

export class IngredientReferenceEntity {
    @ApiProperty()
    title: string;

    @ApiProperty()
    url: string;
}

export class IngredientEntity extends IngredientListItemEntity {
    @ApiPropertyOptional()
    scientific_name?: string | null;

    @ApiPropertyOptional()
    description?: string | null;

    @ApiPropertyOptional()
    full_description?: string | null;

    @ApiPropertyOptional()
    benefits?: string | null;

    @ApiPropertyOptional()
    risks?: string | null;

    @ApiPropertyOptional()
    safety_explanation?: string | null;

    @ApiPropertyOptional()
    purpose?: string | null;

    @ApiPropertyOptional()
    common_uses?: string | null;

    @ApiPropertyOptional()
    pregnancy_safety?: string | null;

    @ApiPropertyOptional()
    child_safety?: string | null;

    @ApiPropertyOptional()
    allergy_risk?: string | null;

    @ApiPropertyOptional()
    carcinogenic_evidence?: string | null;

    @ApiPropertyOptional()
    hormone_disruption_risk?: string | null;

    @ApiPropertyOptional()
    irritation_risk?: string | null;

    @ApiPropertyOptional()
    acne_rating?: number | null;

    @ApiPropertyOptional()
    comedogenic_rating?: number | null;

    @ApiPropertyOptional()
    sensitive_skin_suitability?: string | null;

    @ApiPropertyOptional()
    environmental_impact?: string | null;

    @ApiPropertyOptional()
    is_vegan?: boolean | null;

    @ApiPropertyOptional()
    is_cruelty_free?: boolean | null;

    @ApiPropertyOptional()
    is_biodegradable?: boolean | null;

    @ApiPropertyOptional()
    safety_score?: string | null;

    @ApiPropertyOptional()
    risk_score?: string | null;

    @ApiPropertyOptional()
    confidence_score?: string | null;

    @ApiPropertyOptional()
    research_summary?: string | null;

    @ApiPropertyOptional({ type: [IngredientReferenceEntity] })
    references?: IngredientReferenceEntity[] | null;

    @ApiPropertyOptional()
    ai_version?: string | null;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;
}
