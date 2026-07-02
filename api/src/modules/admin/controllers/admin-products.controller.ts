import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { AuthRoles } from '@/modules/auth/interfaces/auth.interface';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { AdminModerationService } from '../services/admin-moderation.service';
import { PaginationQuerySchema, PaginationQueryType } from '../dto/pagination-query.schema';
import { VerifyProductDto } from '../dto/verify-product.dto';
import { FeatureProductDto } from '../dto/feature-product.dto';
import { MergeEntitiesDto } from '../dto/merge-entities.dto';

@ApiTags('Admin — Products')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(AuthRoles.ADMIN)
@Controller('admin/products')
export class AdminProductsController {
    constructor(private readonly adminModerationService: AdminModerationService) {}

    @Get('pending')
    @ApiOperation({ summary: 'List products awaiting review' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    getPending(
        @Query(new ZodValidationPipe(PaginationQuerySchema)) query: PaginationQueryType,
    ) {
        return this.adminModerationService.getPendingProducts(query);
    }

    @Post('merge')
    @ApiOperation({ summary: 'Merge two duplicate products' })
    merge(@Body() dto: MergeEntitiesDto) {
        return this.adminModerationService.mergeProducts(dto);
    }

    @Patch(':uuid/verify')
    @ApiOperation({ summary: 'Approve or reject a pending product' })
    @ApiParam({ name: 'uuid', description: 'Product UUID' })
    verify(@Param('uuid') product_uuid: string, @Body() dto: VerifyProductDto) {
        return this.adminModerationService.verifyProduct(product_uuid, dto);
    }

    @Patch(':uuid/feature')
    @ApiOperation({ summary: 'Toggle whether a product is featured' })
    @ApiParam({ name: 'uuid', description: 'Product UUID' })
    feature(@Param('uuid') product_uuid: string, @Body() dto: FeatureProductDto) {
        return this.adminModerationService.toggleFeature(product_uuid, dto);
    }
}
