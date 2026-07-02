import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';
import { ColorIndicator, SafetyLevel } from 'generated/prisma';

export class CreateIngredientDto {
    @ApiProperty({ example: 'Niacinamide' })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    synonyms?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    scientific_name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    ai_summary?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    benefits?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    risks?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    purpose?: string;

    @ApiPropertyOptional({ enum: SafetyLevel })
    @IsOptional()
    @IsEnum(SafetyLevel)
    pregnancy_safety?: SafetyLevel;

    @ApiPropertyOptional({ enum: ColorIndicator })
    @IsOptional()
    @IsEnum(ColorIndicator)
    color_indicator?: ColorIndicator;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    overall_score?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    safety_score?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_vegan?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_cruelty_free?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    acne_rating?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    comedogenic_rating?: number;
}
