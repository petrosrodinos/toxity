import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { IngredientsService } from './ingredients.service';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import {
    IngredientQuerySchema,
    IngredientQueryType,
} from './dto/ingredient-query.schema';
import {
    IngredientEntity,
    IngredientListItemEntity,
} from './entities/ingredient.entity';

@ApiTags('Ingredients')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('ingredients')
export class IngredientsController {
    constructor(private readonly ingredients_service: IngredientsService) {}

    @Get()
    @ApiOperation({ summary: 'List ingredients with search and filters' })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'color_indicator', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiResponse({ status: 200, type: [IngredientListItemEntity] })
    find_all(
        @Query(new ZodValidationPipe(IngredientQuerySchema))
        query: IngredientQueryType,
    ) {
        return this.ingredients_service.find_all(query);
    }

    @Get(':uuid')
    @ApiOperation({ summary: 'Get full ingredient detail' })
    @ApiParam({ name: 'uuid', description: 'Ingredient UUID' })
    @ApiResponse({ status: 200, type: IngredientEntity })
    find_one(
        @CurrentUser('uuid') user_uuid: string,
        @Param('uuid') ingredient_uuid: string,
    ) {
        return this.ingredients_service.find_one(ingredient_uuid, user_uuid);
    }
}
