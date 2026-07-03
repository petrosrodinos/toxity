import type { ColorIndicator } from "@/components/ui/safety-badge";
import type { VerificationStatus } from "@/features/products/interfaces/products.interfaces";

export type MergeEntitiesDto = {
    keep_uuid: string;
    merge_uuid: string;
};

export type AdminProductIngredient = {
    uuid: string;
    name: string;
    color_indicator: ColorIndicator;
    position: number;
};

export type AdminProductListItem = {
    uuid: string;
    name: string;
    barcode: string | null;
    package_size: string | null;
    overall_score: string;
    color_indicator: ColorIndicator;
    verification_status: VerificationStatus;
    is_featured: boolean;
    scan_count: number;
    brand: {
        uuid: string;
        name: string;
        logo_url?: string | null;
    };
    ingredients: AdminProductIngredient[];
};

export type AdminProductQuery = {
    page?: number;
    limit?: number;
    search?: string;
};

export type UpdateProductDto = {
    name?: string;
    barcode?: string;
    package_size?: string;
    is_featured?: boolean;
    verification_status?: VerificationStatus;
};

export const ProductVerificationDecisions = {
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
} as const;

export type ProductVerificationDecision =
    (typeof ProductVerificationDecisions)[keyof typeof ProductVerificationDecisions];

export type VerifyProductDto = {
    status: ProductVerificationDecision;
};

export type FeatureProductDto = {
    is_featured: boolean;
};

export type AnalysisVersion = {
    uuid: string;
    ai_version?: string | null;
    snapshot: Record<string, unknown>;
    created_at: string;
};
