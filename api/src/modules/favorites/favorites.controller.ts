import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import {
    FavoriteCheckQuerySchema,
    FavoriteCheckQueryType,
    FavoritesQuerySchema,
    FavoritesQueryType,
} from './dto/favorites-query.schema';
import { FavoriteCheckEntity, FavoriteEntity } from './entities/favorite.entity';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) {}

    @Get()
    @ApiOperation({ summary: 'List the current user favorites' })
    @ApiQuery({ name: 'type', required: false, enum: ['PRODUCT', 'INGREDIENT', 'BRAND'] })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiResponse({ status: 200, type: [FavoriteEntity] })
    findAll(
        @CurrentUser('uuid') user_uuid: string,
        @Query(new ZodValidationPipe(FavoritesQuerySchema)) query: FavoritesQueryType,
    ) {
        return this.favoritesService.findAll(user_uuid, query);
    }

    @Get('check')
    @ApiOperation({ summary: 'Check whether an entity is favorited' })
    @ApiQuery({ name: 'entity_type', required: true, enum: ['PRODUCT', 'INGREDIENT', 'BRAND'] })
    @ApiQuery({ name: 'entity_uuid', required: true })
    @ApiResponse({ status: 200, type: FavoriteCheckEntity })
    check(
        @CurrentUser('uuid') user_uuid: string,
        @Query(new ZodValidationPipe(FavoriteCheckQuerySchema)) query: FavoriteCheckQueryType,
    ) {
        return this.favoritesService.check(user_uuid, query.entity_type, query.entity_uuid);
    }

    @Post()
    @ApiOperation({ summary: 'Favorite a product, ingredient, or brand' })
    @ApiResponse({ status: 201, type: FavoriteEntity })
    create(@CurrentUser('uuid') user_uuid: string, @Body() dto: CreateFavoriteDto) {
        return this.favoritesService.create(user_uuid, dto);
    }

    @Delete(':uuid')
    @ApiOperation({ summary: 'Remove a favorite' })
    @ApiParam({ name: 'uuid', description: 'Favorite UUID' })
    remove(@CurrentUser('uuid') user_uuid: string, @Param('uuid') favorite_uuid: string) {
        return this.favoritesService.remove(user_uuid, favorite_uuid);
    }
}
