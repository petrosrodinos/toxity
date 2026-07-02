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

        const where = {
            verification_status: 'APPROVED' as const,
            subcategory: {
                category_uuid,
            },
        };

        const [items, count] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { created_at: 'desc' },
                include: {
                    brand: true,
                    images: {
                        orderBy: { sort_order: 'asc' },
                        take: 1,
                    },
                },
            }),
            this.prisma.product.count({ where }),
        ]);

        const total_pages = Math.ceil(count / query.limit);

        return {
            data: items.map((product) => ({
                uuid: product.uuid,
                name: product.name,
                barcode: product.barcode,
                overall_score: product.overall_score.toString(),
                color_indicator: product.color_indicator,
                is_featured: product.is_featured,
                scan_count: product.scan_count,
                package_size: product.package_size,
                brand: {
                    uuid: product.brand.uuid,
                    name: product.brand.name,
                    logo_url: product.brand.logo_url,
                },
                hero_image_url: product.images[0]?.url ?? null,
            })),
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
}
