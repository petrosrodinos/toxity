import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OcrAdapter } from './ocr.adapter';
import { OcrService } from './services/ocr.service';
import { VisionConfig } from './config/vision.config';

@Module({
    imports: [ConfigModule],
    providers: [VisionConfig, OcrAdapter, OcrService],
    exports: [OcrService, VisionConfig],
})
export class OcrModule {}
