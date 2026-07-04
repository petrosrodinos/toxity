export const ProductCreationJobStatuses = {
    PENDING: "PENDING",
    OCR: "OCR",
    ANALYZING: "ANALYZING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
} as const;

export type ProductCreationJobStatus =
    (typeof ProductCreationJobStatuses)[keyof typeof ProductCreationJobStatuses];

export type OcrResult = {
    name: string | null;
    brand: string | null;
    ingredients: string[];
    claims: string[];
};

export type ProductCreationJob = {
    uuid: string;
    status: ProductCreationJobStatus;
    barcode: string | null;
    ingredient_label_image_url: string | null;
    front_label_image_url: string | null;
    ocr_result: OcrResult | null;
    product_uuid: string | null;
    error_message: string | null;
    created_at: string;
    updated_at: string;
};

export type ProductCreationIdentifyResult = {
    matched_product_uuid: string | null;
    ocr_result: {
        name: string | null;
        brand: string | null;
        claims: string[];
    };
};

export type CreateProductCreationJobDto = {
    barcode?: string;
};
