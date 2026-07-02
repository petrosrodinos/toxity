import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductCreationJobDto {
    @ApiPropertyOptional({
        description: 'Barcode scanned before starting creation flow',
        example: '3017620422003',
    })
    @IsOptional()
    @IsString()
    @MaxLength(64)
    barcode?: string;
}
