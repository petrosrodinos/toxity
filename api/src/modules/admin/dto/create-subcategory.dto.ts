import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSubcategoryDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    category_uuid: string;

    @ApiProperty({ example: 'Moisturizers' })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    sort_order?: number;
}
