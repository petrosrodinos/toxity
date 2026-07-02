import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Beauty' })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    icon_url?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    sort_order?: number;
}
