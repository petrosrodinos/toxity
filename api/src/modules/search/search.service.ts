import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ProductsService } from '@/modules/products/products.service';
import { IngredientsService } from '@/modules/ingredients/ingredients.service';
import { BrandsService } from '@/modules/brands/brands.service';
import {
    get_barcode_lookup_variants,
    normalize_barcode_digits,
} from '@/shared/utils/barcode.utils';
import { normalize_ingredient_name } from '@/shared/utils/ingredient.utils';
import { SearchQueryType } from './dto/search-query.schema';
import {
    SearchProductsEntity,
    SearchResultEntity,
} from './entities/search-result.entity';

const BARCODE_PATTERN = /^\d{8,14}$/;

const product_list_include = {
    brand: true,
    images: {
        orderBy: { sort_order: 'asc' as const },
        take: 1,
    },
} satisfies Prisma.ProductInclude;

@Injectable()
export class SearchService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly productsService: ProductsService,
        private readonly ingredientsService: IngredientsService,
        private readonly brandsService: BrandsService,
    ) {}

    async search(query: SearchQueryType): Promise<SearchResultEntity> {
        const trimmed = query.q.trim();

        if (BARCODE_PATTERN.test(trimmed)) {
            const barcode_match = await this.searchByBarcode(trimmed);

            if (barcode_match) {
                return {
                    products: barcode_match,
                    ingredients: this.emptyResult(),
                    brands: this.emptyResult(),
                };
            }
        }

        const [products, ingredients, brands] = await Promise.all([
            this.searchProducts(trimmed, query),
            this.ingredientsService.find_all({
                page: query.page,
                limit: query.limit,
                search: trimmed,
            }),
            this.brandsService.find_all({
                page: query.page,
                limit: query.limit,
                search: trimmed,
            }),
        ]);

        return { products, ingredients, brands };
    }

    private async searchByBarcode(
        barcode: string,
    ): Promise<SearchProductsEntity | null> {
        const variants = get_barcode_lookup_variants(barcode);

        if (variants.length === 0) {
            return null;
        }

        const product = await this.prisma.product.findFirst({
            where: {
                barcode: { in: variants },
            },
            include: product_list_include,
        });

        if (!product) {
            return null;
        }

        return {
            data: [this.productsService.to_list_item(product)],
            pagination: this.singleItemPagination(),
        };
    }

    private async searchProducts(
        q: string,
        query: SearchQueryType,
    ): Promise<SearchProductsEntity> {
        const barcode_variants = get_barcode_lookup_variants(q);
        const normalized_ingredient = normalize_ingredient_name(q);

        const where: Prisma.ProductWhereInput = {
            OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { brand: { name: { contains: q, mode: 'insensitive' } } },
                ...(barcode_variants.length > 0
                    ? [{ barcode: { in: barcode_variants } }]
                    : []),
                ...(normalize_barcode_digits(q).length > 0 &&
                barcode_variants.length === 0
                    ? [
                          {
                              barcode: {
                                  contains: normalize_barcode_digits(q),
                              },
                          },
                      ]
                    : []),
                {
                    product_ingredients: {
                        some: {
                            ingredient: {
                                OR: [
                                    {
                                        name: {
                                            contains: q,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        name_normalized: {
                                            contains: normalized_ingredient,
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            ],
            ...(query.subcategory_uuid && {
                subcategory_uuid: query.subcategory_uuid,
            }),
            ...(query.category_uuid && {
                subcategory: { category_uuid: query.category_uuid },
            }),
        };

        const [items, count] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: this.resolveSort(query.sort),
                include: product_list_include,
            }),
            this.prisma.product.count({ where }),
        ]);

        const total_pages = Math.ceil(count / query.limit);

        return {
            data: items.map((product) => this.productsService.to_list_item(product)),
            pagination: {
                total: count,
                page: query.page,
                limit: query.limit,
                total_pages,
                has_next: query.page < total_pages,
                has_prev: query.page > 1,
            },
        };
    }

    private resolveSort(
        sort: SearchQueryType['sort'],
    ): Prisma.ProductOrderByWithRelationInput {
        switch (sort) {
            case 'highest_rated':
                return { overall_score: 'desc' };
            case 'lowest_rated':
                return { overall_score: 'asc' };
            case 'most_popular':
                return { scan_count: 'desc' };
            case 'newest':
            default:
                return { created_at: 'desc' };
        }
    }

    private singleItemPagination() {
        return {
            total: 1,
            page: 1,
            limit: 1,
            total_pages: 1,
            has_next: false,
            has_prev: false,
        };
    }

    private emptyResult() {
        return {
            data: [],
            pagination: {
                total: 0,
                page: 1,
                limit: 0,
                total_pages: 0,
                has_next: false,
                has_prev: false,
            },
        };
    }
}
