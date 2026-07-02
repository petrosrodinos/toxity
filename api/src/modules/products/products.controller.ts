import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import {
    ProductQuerySchema,
    ProductQueryType,
} from './dto/product-query.schema';
import {
    ProductDetailEntity,
    ProductListItemEntity,
} from './entities/product.entity';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly products_service: ProductsService) {}

    @Get()
    @ApiOperation({ summary: 'List products with filters and sorting' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'featured', required: false })
    @ApiQuery({ name: 'category_uuid', required: false })
    @ApiQuery({ name: 'subcategory_uuid', required: false })
    @ApiQuery({ name: 'brand_uuid', required: false })
    @ApiQuery({
        name: 'sort',
        required: false,
        enum: ['highest_rated', 'lowest_rated', 'newest', 'most_popular'],
    })
    @ApiResponse({ status: 200, type: [ProductListItemEntity] })
    find_all(
        @Query(new ZodValidationPipe(ProductQuerySchema))
        query: ProductQueryType,
    ) {
        return this.products_service.find_all(query);
    }

    @Get('barcode/:barcode')
    @ApiOperation({ summary: 'Lookup product by barcode' })
    @ApiParam({ name: 'barcode', description: 'Product barcode' })
    @ApiResponse({ status: 200, type: ProductDetailEntity })
    find_by_barcode(
        @CurrentUser('uuid') user_uuid: string,
        @Param('barcode') barcode: string,
    ) {
        return this.products_service.find_by_barcode(barcode, user_uuid);
    }

    @Get(':uuid')
    @ApiOperation({ summary: 'Get full product detail' })
    @ApiParam({ name: 'uuid', description: 'Product UUID' })
    @ApiResponse({ status: 200, type: ProductDetailEntity })
    find_one(
        @CurrentUser('uuid') user_uuid: string,
        @Param('uuid') product_uuid: string,
    ) {
        return this.products_service.find_one(product_uuid, user_uuid);
    }
}
