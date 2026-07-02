import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { ScanMethod } from 'generated/prisma';

export class CreateScanDto {
    @ApiProperty({ description: 'Product UUID to record a scan for' })
    @IsUUID()
    product_uuid: string;

    @ApiProperty({ enum: ScanMethod, example: ScanMethod.BARCODE })
    @IsEnum(ScanMethod)
    scan_method: ScanMethod;
}
