import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import {
    CategoryProductsQuerySchema,
    CategoryProductsQueryType,
} from './dto/category-products-query.schema';
import { CategoryEntity } from './entities/category.entity';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categories_service: CategoriesService) {}

    @Get()
    @ApiOperation({ summary: 'Get category tree with subcategories' })
    @ApiResponse({ status: 200, type: [CategoryEntity] })
    find_tree() {
        return this.categories_service.find_tree();
    }

    @Get(':uuid/products')
    @ApiOperation({ summary: 'List products in a category (paginated)' })
    @ApiParam({ name: 'uuid', description: 'Category UUID' })
    find_products(
        @Param('uuid') category_uuid: string,
        @Query(new ZodValidationPipe(CategoryProductsQuerySchema))
        query: CategoryProductsQueryType,
    ) {
        return this.categories_service.find_products_by_category(
            category_uuid,
            query,
        );
    }
}
