import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { FavoriteEntityType, Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoritesQueryType } from './dto/favorites-query.schema';
import { FavoriteEntity } from './entities/favorite.entity';

const product_list_include = {
    brand: true,
    images: {
        orderBy: { sort_order: 'asc' as const },
        take: 1,
    },
} satisfies Prisma.ProductInclude;

type ProductSummaryRecord = Prisma.ProductGetPayload<{
    include: typeof product_list_include;
}>;
type IngredientSummaryRecord = Prisma.IngredientGetPayload<object>;
type BrandSummaryRecord = Prisma.BrandGetPayload<object>;

@Injectable()
export class FavoritesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        user_uuid: string,
        dto: CreateFavoriteDto,
    ): Promise<FavoriteEntity> {
        await this.assertEntityExists(dto.entity_type, dto.entity_uuid);

        const existing = await this.prisma.userFavorite.findUnique({
            where: {
                user_uuid_entity_type_entity_uuid: {
                    user_uuid,
                    entity_type: dto.entity_type,
                    entity_uuid: dto.entity_uuid,
                },
            },
        });

        if (existing) {
            throw new ConflictException('Already favorited');
        }

        const favorite = await this.prisma.userFavorite.create({
            data: {
                user_uuid,
                entity_type: dto.entity_type,
                entity_uuid: dto.entity_uuid,
            },
        });

        const [entity] = await this.enrich([favorite]);
        return entity;
    }

    async remove(user_uuid: string, favorite_uuid: string): Promise<void> {
        const favorite = await this.prisma.userFavorite.findFirst({
            where: { uuid: favorite_uuid, user_uuid },
        });

        if (!favorite) {
            throw new NotFoundException('Favorite not found');
        }

        await this.prisma.userFavorite.delete({ where: { uuid: favorite_uuid } });
    }

    async check(
        user_uuid: string,
        entity_type: FavoriteEntityType,
        entity_uuid: string,
    ): Promise<{ is_favorited: boolean; favorite_uuid: string | null }> {
        const favorite = await this.prisma.userFavorite.findUnique({
            where: {
                user_uuid_entity_type_entity_uuid: {
                    user_uuid,
                    entity_type,
                    entity_uuid,
                },
            },
        });

        return {
            is_favorited: !!favorite,
            favorite_uuid: favorite?.uuid ?? null,
        };
    }

    async isFavorited(
        user_uuid: string,
        entity_type: FavoriteEntityType,
        entity_uuid: string,
    ): Promise<boolean> {
        const favorite = await this.prisma.userFavorite.findUnique({
            where: {
                user_uuid_entity_type_entity_uuid: {
                    user_uuid,
                    entity_type,
                    entity_uuid,
                },
            },
        });

        return !!favorite;
    }

    async findAll(user_uuid: string, query: FavoritesQueryType) {
        const where = {
            user_uuid,
            ...(query.type && { entity_type: query.type }),
        };

        const [items, count] = await Promise.all([
            this.prisma.userFavorite.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { created_at: 'desc' as const },
            }),
            this.prisma.userFavorite.count({ where }),
        ]);

        const data = await this.enrich(items);
        const total_pages = Math.ceil(count / query.limit);

        return {
            data,
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

    private async assertEntityExists(
        entity_type: FavoriteEntityType,
        entity_uuid: string,
    ): Promise<void> {
        const exists = await this.entityExists(entity_type, entity_uuid);

        if (!exists) {
            throw new NotFoundException(
                `${entity_type.toLowerCase()} not found`,
            );
        }
    }

    private async entityExists(
        entity_type: FavoriteEntityType,
        entity_uuid: string,
    ): Promise<boolean> {
        switch (entity_type) {
            case 'PRODUCT':
                return !!(await this.prisma.product.findUnique({
                    where: { uuid: entity_uuid },
                    select: { id: true },
                }));
            case 'INGREDIENT':
                return !!(await this.prisma.ingredient.findUnique({
                    where: { uuid: entity_uuid },
                    select: { id: true },
                }));
            case 'BRAND':
                return !!(await this.prisma.brand.findUnique({
                    where: { uuid: entity_uuid },
                    select: { id: true },
                }));
            default:
                return false;
        }
    }

    private async enrich(
        favorites: {
            uuid: string;
            entity_type: FavoriteEntityType;
            entity_uuid: string;
            created_at: Date;
        }[],
    ): Promise<FavoriteEntity[]> {
        const product_uuids = favorites
            .filter((favorite) => favorite.entity_type === 'PRODUCT')
            .map((favorite) => favorite.entity_uuid);
        const ingredient_uuids = favorites
            .filter((favorite) => favorite.entity_type === 'INGREDIENT')
            .map((favorite) => favorite.entity_uuid);
        const brand_uuids = favorites
            .filter((favorite) => favorite.entity_type === 'BRAND')
            .map((favorite) => favorite.entity_uuid);

        const [products, ingredients, brands] = await Promise.all([
            product_uuids.length
                ? this.prisma.product.findMany({
                      where: { uuid: { in: product_uuids } },
                      include: product_list_include,
                  })
                : Promise.resolve([] as ProductSummaryRecord[]),
            ingredient_uuids.length
                ? this.prisma.ingredient.findMany({
                      where: { uuid: { in: ingredient_uuids } },
                  })
                : Promise.resolve([] as IngredientSummaryRecord[]),
            brand_uuids.length
                ? this.prisma.brand.findMany({
                      where: { uuid: { in: brand_uuids } },
                  })
                : Promise.resolve([] as BrandSummaryRecord[]),
        ]);

        const product_map = new Map(products.map((p) => [p.uuid, p]));
        const ingredient_map = new Map(ingredients.map((i) => [i.uuid, i]));
        const brand_map = new Map(brands.map((b) => [b.uuid, b]));

        return favorites.map((favorite) => ({
            uuid: favorite.uuid,
            entity_type: favorite.entity_type,
            entity_uuid: favorite.entity_uuid,
            created_at: favorite.created_at,
            product: this.toProductSummary(
                product_map.get(favorite.entity_uuid) ?? null,
            ),
            ingredient: this.toIngredientSummary(
                ingredient_map.get(favorite.entity_uuid) ?? null,
            ),
            brand: this.toBrandSummary(brand_map.get(favorite.entity_uuid) ?? null),
        }));
    }

    private toProductSummary(product: ProductSummaryRecord | null) {
        if (!product) return null;

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

    private toIngredientSummary(ingredient: IngredientSummaryRecord | null) {
        if (!ingredient) return null;

        return {
            uuid: ingredient.uuid,
            name: ingredient.name,
            color_indicator: ingredient.color_indicator,
            overall_score: ingredient.overall_score?.toString() ?? null,
            ai_summary: ingredient.ai_summary,
            synonyms: ingredient.synonyms,
        };
    }

    private toBrandSummary(brand: BrandSummaryRecord | null) {
        if (!brand) return null;

        return {
            uuid: brand.uuid,
            name: brand.name,
            slug: brand.slug,
            logo_url: brand.logo_url,
            website: brand.website,
            country: brand.country,
            description: brand.description,
        };
    }
}
