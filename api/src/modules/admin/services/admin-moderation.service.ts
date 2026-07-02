import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ProductsService } from '@/modules/products/products.service';
import { ProductQueryType } from '@/modules/products/dto/product-query.schema';
import { MergeEntitiesDto } from '../dto/merge-entities.dto';
import { VerifyProductDto } from '../dto/verify-product.dto';
import { FeatureProductDto } from '../dto/feature-product.dto';

const product_list_include = {
    brand: true,
    images: {
        orderBy: { sort_order: 'asc' as const },
        take: 1,
    },
} satisfies Prisma.ProductInclude;

@Injectable()
export class AdminModerationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly productsService: ProductsService,
    ) {}

    async getPendingProducts(query: Pick<ProductQueryType, 'page' | 'limit'>) {
        const where: Prisma.ProductWhereInput = {
            verification_status: 'PENDING',
        };

        const [items, count] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { created_at: 'desc' },
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

    async verifyProduct(product_uuid: string, dto: VerifyProductDto) {
        await this.getProductOrThrow(product_uuid);

        return this.prisma.product.update({
            where: { uuid: product_uuid },
            data: { verification_status: dto.status },
        });
    }

    async toggleFeature(product_uuid: string, dto: FeatureProductDto) {
        await this.getProductOrThrow(product_uuid);

        return this.prisma.product.update({
            where: { uuid: product_uuid },
            data: { is_featured: dto.is_featured },
        });
    }

    async mergeProducts(dto: MergeEntitiesDto): Promise<{ product_uuid: string }> {
        this.assertDifferent(dto);

        const [keep, merge] = await Promise.all([
            this.prisma.product.findUnique({ where: { uuid: dto.keep_uuid } }),
            this.prisma.product.findUnique({ where: { uuid: dto.merge_uuid } }),
        ]);

        if (!keep || !merge) {
            throw new NotFoundException('Product not found');
        }

        await this.prisma.$transaction(async (tx) => {
            const merge_scans = await tx.userProductScan.findMany({
                where: { product_uuid: dto.merge_uuid },
            });

            for (const scan of merge_scans) {
                const existing = await tx.userProductScan.findUnique({
                    where: {
                        user_uuid_product_uuid: {
                            user_uuid: scan.user_uuid,
                            product_uuid: dto.keep_uuid,
                        },
                    },
                });

                if (existing) {
                    await tx.userProductScan.delete({ where: { id: scan.id } });
                } else {
                    await tx.userProductScan.update({
                        where: { id: scan.id },
                        data: { product_uuid: dto.keep_uuid },
                    });
                }
            }

            const merge_favorites = await tx.userFavorite.findMany({
                where: { entity_type: 'PRODUCT', entity_uuid: dto.merge_uuid },
            });

            for (const favorite of merge_favorites) {
                const existing = await tx.userFavorite.findUnique({
                    where: {
                        user_uuid_entity_type_entity_uuid: {
                            user_uuid: favorite.user_uuid,
                            entity_type: 'PRODUCT',
                            entity_uuid: dto.keep_uuid,
                        },
                    },
                });

                if (existing) {
                    await tx.userFavorite.delete({ where: { id: favorite.id } });
                } else {
                    await tx.userFavorite.update({
                        where: { id: favorite.id },
                        data: { entity_uuid: dto.keep_uuid },
                    });
                }
            }

            // product_ingredients and product_images cascade-delete with the
            // merged product — they belong to the duplicate record only.
            await tx.product.delete({ where: { uuid: dto.merge_uuid } });

            const scan_count = await tx.userProductScan.count({
                where: { product_uuid: dto.keep_uuid },
            });

            await tx.product.update({
                where: { uuid: dto.keep_uuid },
                data: { scan_count },
            });
        });

        return { product_uuid: dto.keep_uuid };
    }

    async mergeIngredients(
        dto: MergeEntitiesDto,
    ): Promise<{ ingredient_uuid: string }> {
        this.assertDifferent(dto);

        const [keep, merge] = await Promise.all([
            this.prisma.ingredient.findUnique({ where: { uuid: dto.keep_uuid } }),
            this.prisma.ingredient.findUnique({ where: { uuid: dto.merge_uuid } }),
        ]);

        if (!keep || !merge) {
            throw new NotFoundException('Ingredient not found');
        }

        await this.prisma.$transaction(async (tx) => {
            const merge_links = await tx.productIngredient.findMany({
                where: { ingredient_uuid: dto.merge_uuid },
            });

            for (const link of merge_links) {
                const existing = await tx.productIngredient.findUnique({
                    where: {
                        product_uuid_ingredient_uuid: {
                            product_uuid: link.product_uuid,
                            ingredient_uuid: dto.keep_uuid,
                        },
                    },
                });

                if (existing) {
                    await tx.productIngredient.delete({ where: { id: link.id } });
                } else {
                    await tx.productIngredient.update({
                        where: { id: link.id },
                        data: { ingredient_uuid: dto.keep_uuid },
                    });
                }
            }

            const merge_favorites = await tx.userFavorite.findMany({
                where: { entity_type: 'INGREDIENT', entity_uuid: dto.merge_uuid },
            });

            for (const favorite of merge_favorites) {
                const existing = await tx.userFavorite.findUnique({
                    where: {
                        user_uuid_entity_type_entity_uuid: {
                            user_uuid: favorite.user_uuid,
                            entity_type: 'INGREDIENT',
                            entity_uuid: dto.keep_uuid,
                        },
                    },
                });

                if (existing) {
                    await tx.userFavorite.delete({ where: { id: favorite.id } });
                } else {
                    await tx.userFavorite.update({
                        where: { id: favorite.id },
                        data: { entity_uuid: dto.keep_uuid },
                    });
                }
            }

            await tx.ingredient.delete({ where: { uuid: dto.merge_uuid } });
        });

        return { ingredient_uuid: dto.keep_uuid };
    }

    async mergeBrands(dto: MergeEntitiesDto): Promise<{ brand_uuid: string }> {
        this.assertDifferent(dto);

        const [keep, merge] = await Promise.all([
            this.prisma.brand.findUnique({ where: { uuid: dto.keep_uuid } }),
            this.prisma.brand.findUnique({ where: { uuid: dto.merge_uuid } }),
        ]);

        if (!keep || !merge) {
            throw new NotFoundException('Brand not found');
        }

        await this.prisma.$transaction(async (tx) => {
            const merge_products = await tx.product.findMany({
                where: { brand_uuid: dto.merge_uuid },
            });

            for (const product of merge_products) {
                const name_conflict = await tx.product.findFirst({
                    where: {
                        brand_uuid: dto.keep_uuid,
                        name: product.name,
                        uuid: { not: product.uuid },
                    },
                });

                if (name_conflict) {
                    // Leave this one product under the old brand — an admin
                    // can resolve the name collision manually afterward.
                    continue;
                }

                await tx.product.update({
                    where: { uuid: product.uuid },
                    data: { brand_uuid: dto.keep_uuid },
                });
            }

            const remaining = await tx.product.count({
                where: { brand_uuid: dto.merge_uuid },
            });

            if (remaining > 0) {
                throw new BadRequestException(
                    'Could not merge: some products under the duplicate brand have a name conflict with an existing product under the target brand.',
                );
            }

            await tx.brand.delete({ where: { uuid: dto.merge_uuid } });
        });

        return { brand_uuid: dto.keep_uuid };
    }

    private assertDifferent(dto: MergeEntitiesDto): void {
        if (dto.keep_uuid === dto.merge_uuid) {
            throw new BadRequestException(
                'keep_uuid and merge_uuid must be different',
            );
        }
    }

    private async getProductOrThrow(product_uuid: string) {
        const product = await this.prisma.product.findUnique({
            where: { uuid: product_uuid },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }
}
