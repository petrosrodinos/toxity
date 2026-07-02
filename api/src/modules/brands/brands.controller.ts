import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { BrandQuerySchema, BrandQueryType } from './dto/brand-query.schema';
import { BrandDetailEntity, BrandEntity } from './entities/brand.entity';

@ApiTags('Brands')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('brands')
export class BrandsController {
    constructor(private readonly brands_service: BrandsService) {}

    @Get()
    @ApiOperation({ summary: 'List brands with optional search' })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiResponse({ status: 200, type: [BrandEntity] })
    find_all(
        @Query(new ZodValidationPipe(BrandQuerySchema)) query: BrandQueryType,
    ) {
        return this.brands_service.find_all(query);
    }

    @Get(':uuid')
    @ApiOperation({ summary: 'Get brand detail' })
    @ApiParam({ name: 'uuid', description: 'Brand UUID' })
    @ApiResponse({ status: 200, type: BrandDetailEntity })
    find_one(@Param('uuid') brand_uuid: string) {
        return this.brands_service.find_one(brand_uuid);
    }
}
