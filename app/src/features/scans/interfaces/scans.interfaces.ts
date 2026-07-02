import type { ProductListItem } from "@/features/products/interfaces/products.interfaces";

export const ScanMethods = {
    BARCODE: "BARCODE",
    OCR: "OCR",
} as const;

export type ScanMethod = (typeof ScanMethods)[keyof typeof ScanMethods];

export type CreateScanDto = {
    product_uuid: string;
    scan_method: ScanMethod;
};

export type Scan = {
    uuid: string;
    scanned_at: string;
    scan_method: ScanMethod;
    product: ProductListItem;
};
