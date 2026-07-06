import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class UpdateProductDto {
    @ApiPropertyOptional({ description: 'Product name' })
    @IsOptional()
    @IsString()
    @MinLength(1)
    name?: string;

    @ApiPropertyOptional({
        description: 'Product barcode (empty string clears it)',
    })
    @IsOptional()
    @IsString()
    barcode?: string;

    @ApiPropertyOptional({
        description: 'Package size, e.g. "150ml" (empty string clears it)',
    })
    @IsOptional()
    @IsString()
    package_size?: string;

    @ApiPropertyOptional({ description: 'Whether the product is featured' })
    @IsOptional()
    @IsBoolean()
    is_featured?: boolean;
}
