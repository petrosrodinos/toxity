import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { FavoriteEntityType } from 'generated/prisma';

export class CreateFavoriteDto {
    @ApiProperty({ enum: FavoriteEntityType })
    @IsEnum(FavoriteEntityType)
    entity_type: FavoriteEntityType;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    entity_uuid: string;
}
