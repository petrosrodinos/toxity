import type { ColorIndicator } from "@/components/ui/safety-badge";
import type { Ingredient } from "@/features/ingredients/interfaces/ingredients.interfaces";
import type { PaginatedResponse, SafetyLevel } from "@/features/ingredients/interfaces/ingredients.interfaces";

export const VerificationStatuses = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
} as const;

export type VerificationStatus =
    (typeof VerificationStatuses)[keyof typeof VerificationStatuses];

export const ProductImageTypes = {
    HERO: "HERO",
    PACKAGE: "PACKAGE",
    INGREDIENT_LABEL: "INGREDIENT_LABEL",
    FRONT_LABEL: "FRONT_LABEL",
} as const;

export type ProductImageType =
    (typeof ProductImageTypes)[keyof typeof ProductImageTypes];

export type ProductBrand = {
    uuid: string;
    name: string;
    logo_url?: string | null;
};

export type ProductCategory = {
    uuid: string;
    name: string;
};

export type ProductSubcategory = {
    uuid: string;
    name: string;
    category: ProductCategory;
};

export type ProductImage = {
    uuid: string;
    url: string;
    type: ProductImageType;
    sort_order: number;
};

export type ProductIngredientItem = {
    position: number;
    ingredient: Ingredient;
};

export type ProductFaqItem = {
    question: string;
    answer: string;
};

export type ProductListItem = {
    uuid: string;
    name: string;
    barcode?: string | null;
    overall_score: string;
    color_indicator: ColorIndicator;
    is_featured: boolean;
    scan_count: number;
    package_size?: string | null;
    brand: ProductBrand;
    hero_image_url?: string | null;
};

export type ProductDetail = ProductListItem & {
    subcategory: ProductSubcategory;
    description?: string | null;
    ai_summary?: string | null;
    benefits?: string | null;
    risks?: string | null;
    warnings?: string | null;
    suitability?: string | null;
    recommended_usage?: string | null;
    storage_info?: string | null;
    pregnancy_safety?: SafetyLevel | null;
    children_safety?: SafetyLevel | null;
    sensitive_skin_safety?: SafetyLevel | null;
    allergy_warnings?: string | null;
    environmental_impact?: string | null;
    is_vegan?: boolean | null;
    is_cruelty_free?: boolean | null;
    scientific_confidence?: string | null;
    marketing_claims: string[];
    verification_status: VerificationStatus;
    images: ProductImage[];
    ingredients: ProductIngredientItem[];
    faq?: ProductFaqItem[] | null;
    is_favorited: boolean;
};

export type ProductQuery = {
    page?: number;
    limit?: number;
    featured?: boolean;
    category_uuid?: string;
    subcategory_uuid?: string;
    brand_uuid?: string;
    sort?: "highest_rated" | "lowest_rated" | "newest" | "most_popular";
};

export type { PaginatedResponse };
