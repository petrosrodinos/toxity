import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class MergeEntitiesDto {
    @ApiProperty({ description: 'UUID of the entity to keep' })
    @IsString()
    @MinLength(1)
    keep_uuid: string;

    @ApiProperty({ description: 'UUID of the duplicate entity to merge and remove' })
    @IsString()
    @MinLength(1)
    merge_uuid: string;
}
