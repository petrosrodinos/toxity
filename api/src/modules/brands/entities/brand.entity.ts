import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    slug: string;

    @ApiPropertyOptional()
    logo_url?: string | null;

    @ApiPropertyOptional()
    website?: string | null;

    @ApiPropertyOptional()
    country?: string | null;

    @ApiPropertyOptional()
    description?: string | null;
}

export class BrandDetailEntity extends BrandEntity {
    @ApiProperty()
    product_count: number;
}
