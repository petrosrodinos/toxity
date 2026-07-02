import { Injectable, Logger } from '@nestjs/common';
import { OcrAdapter } from '../ocr.adapter';
import {
    OcrExtractTextRequest,
    OcrExtractTextResponse,
} from '../interfaces/ocr.interfaces';

@Injectable()
export class OcrService {
    private readonly logger = new Logger(OcrService.name);

    constructor(private readonly ocr_adapter: OcrAdapter) {}

    async extract_text(
        request: OcrExtractTextRequest,
    ): Promise<OcrExtractTextResponse> {
        try {
            return await this.ocr_adapter.extract_text(request);
        } catch (error) {
            this.logger.error('OCR text extraction failed', error);
            throw error;
        }
    }
}
