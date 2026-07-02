import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { SearchQuerySchema, SearchQueryType } from './dto/search-query.schema';
import { SearchResultEntity } from './entities/search-result.entity';

@ApiTags('Search')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    @ApiOperation({ summary: 'Unified search across products, ingredients, and brands' })
    @ApiQuery({ name: 'q', required: true })
    @ApiQuery({ name: 'category_uuid', required: false })
    @ApiQuery({ name: 'subcategory_uuid', required: false })
    @ApiQuery({
        name: 'sort',
        required: false,
        enum: ['highest_rated', 'lowest_rated', 'newest', 'most_popular'],
    })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiResponse({ status: 200, type: SearchResultEntity })
    search(
        @Query(new ZodValidationPipe(SearchQuerySchema)) query: SearchQueryType,
    ) {
        return this.searchService.search(query);
    }
}
