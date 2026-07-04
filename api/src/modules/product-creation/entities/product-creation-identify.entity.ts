import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductCreationIdentifyOcrEntity {
    @ApiPropertyOptional({ nullable: true })
    name: string | null;

    @ApiPropertyOptional({ nullable: true })
    brand: string | null;

    @ApiProperty({ type: [String] })
    claims: string[];
}

export class ProductCreationIdentifyEntity {
    @ApiPropertyOptional({ nullable: true })
    matched_product_uuid: string | null;

    @ApiProperty({ type: ProductCreationIdentifyOcrEntity })
    ocr_result: ProductCreationIdentifyOcrEntity;
}
