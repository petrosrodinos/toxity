import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubcategoryEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    sort_order: number;
}

export class CategoryEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    slug: string;

    @ApiPropertyOptional()
    icon_url?: string | null;

    @ApiProperty()
    sort_order: number;

    @ApiProperty({ type: [SubcategoryEntity] })
    subcategories: SubcategoryEntity[];
}
