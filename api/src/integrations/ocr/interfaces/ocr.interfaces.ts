export interface OcrExtractTextRequest {
    image_buffer: Buffer;
    mime_type?: string;
}

export interface OcrExtractTextResponse {
    raw_text: string;
    confidence?: number;
}

export interface OcrResult {
    name: string | null;
    brand: string | null;
    ingredients: string[];
    claims: string[];
}
