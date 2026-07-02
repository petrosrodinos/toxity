import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { CategoryProductsQueryType } from './dto/category-products-query.schema';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) {}

    async find_tree(): Promise<CategoryEntity[]> {
        const categories = await this.prisma.category.findMany({
            orderBy: { sort_order: 'asc' },
            include: {
                subcategories: {
                    orderBy: { sort_order: 'asc' },
                },
            },
        });

        return categories.map((category) => ({
            uuid: category.uuid,
            name: category.name,
            slug: category.slug,
            icon_url: category.icon_url,
            sort_order: category.sort_order,
            subcategories: category.subcategories.map((subcategory) => ({
                uuid: subcategory.uuid,
                name: subcategory.name,
                slug: subcategory.slug,
                sort_order: subcategory.sort_order,
            })),
        }));
    }

    async find_products_by_category(
        category_uuid: string,
        query: CategoryProductsQueryType,
    ) {
        const category = await this.prisma.category.findUnique({
            where: { uuid: category_uuid },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        // Product model arrives in Feature 05 — return empty paginated list until then.
        const total = 0;

        return {
            data: [],
            pagination: {
                total,
                page: query.page,
                limit: query.limit,
                total_pages: 0,
                has_next: false,
                has_prev: query.page > 1,
            },
        };
    }
}
