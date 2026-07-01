import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileEntity {
    @ApiProperty()
    uuid: string;

    @ApiProperty()
    email: string;

    @ApiPropertyOptional()
    phone?: string | null;

    @ApiProperty()
    role: string;

    @ApiPropertyOptional()
    name?: string | null;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;
}
