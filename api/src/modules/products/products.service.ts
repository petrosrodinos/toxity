import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { IngredientsService } from '@/modules/ingredients/ingredients.service';
import { ProductQueryType } from './dto/product-query.schema';
import {
    ProductDetailEntity,
    ProductFaqItemEntity,
    ProductListItemEntity,
} from './entities/product.entity';

const product_detail_include = {
    brand: true,
    subcategory: {
        include: {
            category: true,
        },
    },
    images: {
        orderBy: { sort_order: 'asc' as const },
    },
    product_ingredients: {
        orderBy: { position: 'asc' as const },
        include: {
            ingredient: true,
        },
    },
} satisfies Prisma.ProductInclude;

type ProductDetailRecord = Prisma.ProductGetPayload<{
    include: typeof product_detail_include;
}>;

type ProductListRecord = Prisma.ProductGetPayload<{
    include: {
        brand: true;
        images: {
            orderBy: { sort_order: 'asc' };
            take: 1;
        };
    };
}>;

@Injectable()
export class ProductsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly ingredients_service: IngredientsService,
    ) {}

    async find_by_barcode(barcode: string): Promise<ProductDetailEntity> {
        const product = await this.prisma.product.findFirst({
            where: {
                barcode,
                verification_status: 'APPROVED',
            },
            include: product_detail_include,
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return this.to_detail_entity(product);
    }

    async find_one(product_uuid: string): Promise<ProductDetailEntity> {
        const product = await this.prisma.product.findFirst({
            where: {
                uuid: product_uuid,
                verification_status: 'APPROVED',
            },
            include: product_detail_include,
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return this.to_detail_entity(product);
    }

    async find_all(query: ProductQueryType) {
        const where: Prisma.ProductWhereInput = {
            verification_status: 'APPROVED',
            ...(query.featured && { is_featured: true }),
            ...(query.brand_uuid && { brand_uuid: query.brand_uuid }),
            ...(query.subcategory_uuid && {
                subcategory_uuid: query.subcategory_uuid,
            }),
            ...(query.category_uuid && {
                subcategory: {
                    category_uuid: query.category_uuid,
                },
            }),
        };

        const order_by = this.resolve_sort(query.sort);

        const [items, count] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: order_by,
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
            data: items.map((product) => this.to_list_item(product)),
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

    to_list_item(product: ProductListRecord): ProductListItemEntity {
        return {
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
        };
    }

    private to_detail_entity(product: ProductDetailRecord): ProductDetailEntity {
        const list_item = this.to_list_item({
            ...product,
            images: product.images.slice(0, 1),
        });

        return {
            ...list_item,
            hero_image_url:
                product.images.find((image) => image.type === 'HERO')?.url ??
                product.images[0]?.url ??
                null,
            subcategory: {
                uuid: product.subcategory.uuid,
                name: product.subcategory.name,
                category: {
                    uuid: product.subcategory.category.uuid,
                    name: product.subcategory.category.name,
                },
            },
            description: product.description,
            ai_summary: product.ai_summary,
            benefits: product.benefits,
            risks: product.risks,
            warnings: product.warnings,
            suitability: product.suitability,
            recommended_usage: product.recommended_usage,
            storage_info: product.storage_info,
            pregnancy_safety: product.pregnancy_safety,
            children_safety: product.children_safety,
            sensitive_skin_safety: product.sensitive_skin_safety,
            allergy_warnings: product.allergy_warnings,
            environmental_impact: product.environmental_impact,
            is_vegan: product.is_vegan,
            is_cruelty_free: product.is_cruelty_free,
            scientific_confidence:
                product.scientific_confidence?.toString() ?? null,
            marketing_claims: product.marketing_claims,
            verification_status: product.verification_status,
            images: product.images.map((image) => ({
                uuid: image.uuid,
                url: image.url,
                type: image.type,
                sort_order: image.sort_order,
            })),
            ingredients: product.product_ingredients.map((item) => ({
                position: item.position,
                ingredient: this.ingredients_service.to_public_entity(
                    item.ingredient,
                ),
            })),
            faq:
                (product.faq as unknown as ProductFaqItemEntity[] | null) ??
                null,
            is_favorited: false,
        };
    }

    private resolve_sort(
        sort: ProductQueryType['sort'],
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
}
