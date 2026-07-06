import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { AuthRoles } from '@/modules/auth/interfaces/auth.interface';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { AdminModerationService } from '../services/admin-moderation.service';
import {
    AdminProductQuerySchema,
    AdminProductQueryType,
} from '../dto/admin-product-query.schema';
import { FeatureProductDto } from '../dto/feature-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { MergeEntitiesDto } from '../dto/merge-entities.dto';

@ApiTags('Admin — Products')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(AuthRoles.ADMIN)
@Controller('admin/products')
export class AdminProductsController {
    constructor(private readonly adminModerationService: AdminModerationService) {}

    @Get()
    @ApiOperation({ summary: 'List all products with their ingredients' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'search', required: false })
    getAll(
        @Query(new ZodValidationPipe(AdminProductQuerySchema))
        query: AdminProductQueryType,
    ) {
        return this.adminModerationService.getAllProducts(query);
    }

    @Post('merge')
    @ApiOperation({ summary: 'Merge two duplicate products' })
    merge(@Body() dto: MergeEntitiesDto) {
        return this.adminModerationService.mergeProducts(dto);
    }

    @Patch(':uuid/feature')
    @ApiOperation({ summary: 'Toggle whether a product is featured' })
    @ApiParam({ name: 'uuid', description: 'Product UUID' })
    feature(@Param('uuid') product_uuid: string, @Body() dto: FeatureProductDto) {
        return this.adminModerationService.toggleFeature(product_uuid, dto);
    }

    @Patch(':uuid')
    @ApiOperation({ summary: 'Update a product' })
    @ApiParam({ name: 'uuid', description: 'Product UUID' })
    update(@Param('uuid') product_uuid: string, @Body() dto: UpdateProductDto) {
        return this.adminModerationService.updateProduct(product_uuid, dto);
    }

    @Delete(':uuid')
    @ApiOperation({ summary: 'Delete a product' })
    @ApiParam({ name: 'uuid', description: 'Product UUID' })
    remove(@Param('uuid') product_uuid: string) {
        return this.adminModerationService.removeProduct(product_uuid);
    }
}
