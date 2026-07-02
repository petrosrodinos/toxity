import type { ColorIndicator } from "@/components/ui/safety-badge";

export const SafetyLevels = {
    SAFE: "SAFE",
    CAUTION: "CAUTION",
    AVOID: "AVOID",
    UNKNOWN: "UNKNOWN",
} as const;

export type SafetyLevel = (typeof SafetyLevels)[keyof typeof SafetyLevels];

export type IngredientReference = {
    title: string;
    url: string;
};

export type Ingredient = {
    uuid: string;
    name: string;
    color_indicator: ColorIndicator;
    overall_score?: string | null;
    ai_summary?: string | null;
    synonyms?: string[];
    scientific_name?: string | null;
    description?: string | null;
    full_description?: string | null;
    benefits?: string | null;
    risks?: string | null;
    safety_explanation?: string | null;
    purpose?: string | null;
    common_uses?: string | null;
    pregnancy_safety?: SafetyLevel | null;
    child_safety?: SafetyLevel | null;
    allergy_risk?: string | null;
    carcinogenic_evidence?: string | null;
    hormone_disruption_risk?: string | null;
    irritation_risk?: string | null;
    acne_rating?: number | null;
    comedogenic_rating?: number | null;
    sensitive_skin_suitability?: SafetyLevel | null;
    environmental_impact?: string | null;
    is_vegan?: boolean | null;
    is_cruelty_free?: boolean | null;
    is_biodegradable?: boolean | null;
    safety_score?: string | null;
    risk_score?: string | null;
    confidence_score?: string | null;
    research_summary?: string | null;
    references?: IngredientReference[] | null;
    ai_version?: string | null;
    created_at: string;
    updated_at: string;
};

export type IngredientQuery = {
    search?: string;
    color_indicator?: ColorIndicator;
    page?: number;
    limit?: number;
};

export type PaginatedResponse<T> = {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
        has_next: boolean;
        has_prev: boolean;
    };
};
