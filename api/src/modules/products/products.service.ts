import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProductImageType } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { IngredientsService } from '@/modules/ingredients/ingredients.service';
import { FavoritesService } from '@/modules/favorites/favorites.service';
import {
    get_barcode_lookup_variants,
} from '@/shared/utils/barcode.utils';
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

type ProductImageRecord = {
    url: string;
    type: ProductImageType;
    sort_order: number;
};

@Injectable()
export class ProductsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly ingredients_service: IngredientsService,
        private readonly favorites_service: FavoritesService,
    ) {}

    async find_by_barcode(
        barcode: string,
        user_uuid: string,
    ): Promise<ProductDetailEntity | null> {
        // A missing barcode is an expected outcome of scanning (users scan
        // products not yet in the catalog). Return null with a 200 instead of
        // throwing 404 so the client treats it as a normal "not found" result
        // rather than an error that triggers retries.
        //
        // Barcodes are globally unique — any product with a matching barcode
        // should be returned so scan/create flows never start a duplicate entry.
        const product = await this.find_product_record_by_barcode(barcode);

        if (!product) {
            return null;
        }

        const is_favorited = await this.favorites_service.isFavorited(
            user_uuid,
            'PRODUCT',
            product.uuid,
        );

        return this.to_detail_entity(product, is_favorited);
    }

    async find_existing_by_identity(input: {
        barcode?: string | null;
        name?: string | null;
        brand?: string | null;
    }): Promise<string | null> {
        if (input.barcode) {
            const by_barcode = await this.find_product_record_by_barcode(
                input.barcode,
            );

            if (by_barcode) {
                return by_barcode.uuid;
            }
        }

        const name = input.name?.trim();
        const brand = input.brand?.trim();

        if (!name || !brand) {
            return null;
        }

        const exact_match = await this.prisma.product.findFirst({
            where: {
                name: { equals: name, mode: 'insensitive' },
                brand: { name: { equals: brand, mode: 'insensitive' } },
            },
            select: { uuid: true },
        });

        if (exact_match) {
            return exact_match.uuid;
        }

        const fuzzy_match = await this.prisma.product.findFirst({
            where: {
                name: { contains: name, mode: 'insensitive' },
                brand: { name: { contains: brand, mode: 'insensitive' } },
            },
            orderBy: { scan_count: 'desc' },
            select: { uuid: true },
        });

        return fuzzy_match?.uuid ?? null;
    }

    async find_one(
        product_uuid: string,
        user_uuid: string,
    ): Promise<ProductDetailEntity> {
        const product = await this.prisma.product.findFirst({
            where: {
                uuid: product_uuid,
            },
            include: product_detail_include,
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const is_favorited = await this.favorites_service.isFavorited(
            user_uuid,
            'PRODUCT',
            product.uuid,
        );

        return this.to_detail_entity(product, is_favorited);
    }

    async find_all(query: ProductQueryType) {
        const where: Prisma.ProductWhereInput = {
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
            hero_image_url: this.resolve_hero_image_url(product.images),
        };
    }

    resolve_hero_image_url(
        images: ProductImageRecord[],
    ): string | null {
        const ordered = [...images].sort(
            (left, right) => left.sort_order - right.sort_order,
        );

        return (
            ordered.find((image) => image.type === ProductImageType.HERO)
                ?.url ??
            ordered.find((image) => image.type === ProductImageType.FRONT_LABEL)
                ?.url ??
            ordered.find(
                (image) => image.type !== ProductImageType.INGREDIENT_LABEL,
            )?.url ??
            ordered[0]?.url ??
            null
        );
    }

    private async find_product_record_by_barcode(
        barcode: string,
    ): Promise<ProductDetailRecord | null> {
        const variants = get_barcode_lookup_variants(barcode);

        if (variants.length === 0) {
            return null;
        }

        return this.prisma.product.findFirst({
            where: { barcode: { in: variants } },
            include: product_detail_include,
        });
    }

    private to_detail_entity(
        product: ProductDetailRecord,
        is_favorited: boolean,
    ): ProductDetailEntity {
        const list_item = this.to_list_item({
            ...product,
            images: product.images.slice(0, 1),
        });

        return {
            ...list_item,
            hero_image_url: this.resolve_hero_image_url(product.images),
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
            is_favorited,
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
