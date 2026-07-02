export type MergeEntitiesDto = {
    keep_uuid: string;
    merge_uuid: string;
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
