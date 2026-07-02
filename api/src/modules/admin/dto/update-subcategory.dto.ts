import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { CreateSubcategoryDto } from './create-subcategory.dto';

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(1)
    category_uuid?: string;
}
