import { Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { AuthRoles } from '@/modules/auth/interfaces/auth.interface';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { PaginationQuerySchema, PaginationQueryType } from '@/modules/admin/dto/pagination-query.schema';
import { ReanalysisService } from '../services/reanalysis.service';

@ApiTags('Admin — Reanalysis')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(AuthRoles.ADMIN)
@Controller('admin')
export class AdminReanalysisController {
    constructor(private readonly reanalysisService: ReanalysisService) {}

    @Post('products/:uuid/reanalyze')
    @HttpCode(202)
    @ApiOperation({ summary: 'Trigger AI reanalysis for a product' })
    @ApiParam({ name: 'uuid', description: 'Product UUID' })
    reanalyzeProduct(@Param('uuid') product_uuid: string) {
        return this.reanalysisService.triggerProductReanalysis(product_uuid);
    }

    @Post('ingredients/:uuid/reanalyze')
    @HttpCode(202)
    @ApiOperation({ summary: 'Trigger AI reanalysis for an ingredient' })
    @ApiParam({ name: 'uuid', description: 'Ingredient UUID' })
    reanalyzeIngredient(@Param('uuid') ingredient_uuid: string) {
        return this.reanalysisService.triggerIngredientReanalysis(ingredient_uuid);
    }

    @Get('products/:uuid/versions')
    @ApiOperation({ summary: 'List analysis version history for a product' })
    @ApiParam({ name: 'uuid', description: 'Product UUID' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    getProductVersions(
        @Param('uuid') product_uuid: string,
        @Query(new ZodValidationPipe(PaginationQuerySchema)) query: PaginationQueryType,
    ) {
        return this.reanalysisService.getProductVersions(product_uuid, query);
    }

    @Get('ingredients/:uuid/versions')
    @ApiOperation({ summary: 'List analysis version history for an ingredient' })
    @ApiParam({ name: 'uuid', description: 'Ingredient UUID' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    getIngredientVersions(
        @Param('uuid') ingredient_uuid: string,
        @Query(new ZodValidationPipe(PaginationQuerySchema)) query: PaginationQueryType,
    ) {
        return this.reanalysisService.getIngredientVersions(ingredient_uuid, query);
    }
}
