import { Injectable, Logger } from '@nestjs/common';
import { VisionConfig } from './config/vision.config';
import {
    OcrExtractTextRequest,
    OcrExtractTextResponse,
} from './interfaces/ocr.interfaces';

@Injectable()
export class OcrAdapter {
    private readonly logger = new Logger(OcrAdapter.name);

    constructor(private readonly vision_config: VisionConfig) {}

    async extract_text(
        request: OcrExtractTextRequest,
    ): Promise<OcrExtractTextResponse> {
        const client = this.vision_config.get_client();

        if (!client) {
            throw new Error('Google Cloud Vision is not configured');
        }

        try {
            const [result] = await client.textDetection({
                image: { content: request.image_buffer },
            });

            const annotation = result.fullTextAnnotation;
            const raw_text = annotation?.text?.trim() ?? '';

            if (!raw_text) {
                throw new Error('No text detected in image');
            }

            const confidence = annotation?.pages?.[0]?.confidence;

            return {
                raw_text,
                confidence,
            };
        } catch (error) {
            this.logger.error('Vision OCR extraction failed', error);
            throw error;
        }
    }
}
