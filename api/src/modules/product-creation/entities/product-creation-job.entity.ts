import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCreationJobStatus } from 'generated/prisma';
import { OcrResult } from '@/integrations/ocr/interfaces/ocr.interfaces';

export class OcrResultEntity implements OcrResult {
    @ApiPropertyOptional({ nullable: true })
    name: string | null;

    @ApiPropertyOptional({ nullable: true })
    brand: string | null;

    @ApiProperty({ type: [String] })
    ingredients: string[];

    @ApiProperty({ type: [String] })
    claims: string[];
}

export class ProductCreationJobEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty({ enum: ProductCreationJobStatus })
    status: ProductCreationJobStatus;

    @ApiPropertyOptional({ nullable: true })
    barcode: string | null;

    @ApiPropertyOptional({ nullable: true })
    ingredient_label_image_url: string | null;

    @ApiPropertyOptional({ nullable: true })
    front_label_image_url: string | null;

    @ApiPropertyOptional({ type: OcrResultEntity, nullable: true })
    ocr_result: OcrResult | null;

    @ApiPropertyOptional({ nullable: true })
    product_uuid: string | null;

    @ApiPropertyOptional({ nullable: true })
    error_message: string | null;

    @ApiPropertyOptional({
        nullable: true,
        description:
            'Set when front-label upload runs product identification against the catalog.',
    })
    matched_product_uuid?: string | null;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;
}
