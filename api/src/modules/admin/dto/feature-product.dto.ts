import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class FeatureProductDto {
    @ApiProperty()
    @IsBoolean()
    is_featured: boolean;
}
