import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'Jane Doe' })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name?: string;
}
