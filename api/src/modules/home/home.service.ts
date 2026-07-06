import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { CacheService } from '@/shared/services/cache/cache.service';
import { ProductsService } from '@/modules/products/products.service';
import { IngredientsService } from '@/modules/ingredients/ingredients.service';
import { getDailyTip } from '@/shared/config/daily-tips/daily-tips';
import { HomeFeedEntity } from './entities/home.entity';

const HOME_CACHE_TTL_MS = 10 * 60 * 1000;

const product_list_include = {
    brand: true,
    images: {
        orderBy: { sort_order: 'asc' as const },
        take: 1,
    },
} satisfies Prisma.ProductInclude;

const SECTION_LIMIT = 10;
const CONTINUE_SCANNING_LIMIT = 5;
const RECENTLY_SCANNED_LIMIT = 10;

@Injectable()
export class HomeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: CacheService,
        private readonly productsService: ProductsService,
        private readonly ingredientsService: IngredientsService,
    ) {}

    async getHomeFeed(user_uuid: string): Promise<HomeFeedEntity> {
        const [
            recent_scans,
            trending,
            highest_rated,
            new_products,
            recommended,
            categories,
            ingredient_spotlight,
        ] = await Promise.all([
            this.getRecentScannedProducts(user_uuid),
            this.getOrSetCache('home:trending', () =>
                this.prisma.product.findMany({
                    where: {},
                    orderBy: { scan_count: 'desc' },
                    take: SECTION_LIMIT,
                    include: product_list_include,
                }),
            ),
            this.getOrSetCache('home:highest_rated', () =>
                this.prisma.product.findMany({
                    where: {},
                    orderBy: { overall_score: 'desc' },
                    take: SECTION_LIMIT,
                    include: product_list_include,
                }),
            ),
            this.getOrSetCache('home:new_products', () =>
                this.prisma.product.findMany({
                    where: {},
                    orderBy: { created_at: 'desc' },
                    take: SECTION_LIMIT,
                    include: product_list_include,
                }),
            ),
            this.getOrSetCache('home:recommended', () =>
                this.prisma.product.findMany({
                    where: {},
                    orderBy: [{ is_featured: 'desc' }, { overall_score: 'desc' }],
                    take: SECTION_LIMIT,
                    include: product_list_include,
                }),
            ),
            this.getOrSetCache('home:categories', () =>
                this.prisma.category.findMany({
                    orderBy: { sort_order: 'asc' },
                    select: { uuid: true, name: true, slug: true, icon_url: true },
                }),
            ),
            this.getOrSetCache('home:ingredient_spotlight', () =>
                this.pickIngredientSpotlight(),
            ),
        ]);

        return {
            continue_scanning: recent_scans
                .slice(0, CONTINUE_SCANNING_LIMIT)
                .map((product) => this.productsService.to_list_item(product)),
            recently_scanned: recent_scans
                .slice(0, RECENTLY_SCANNED_LIMIT)
                .map((product) => this.productsService.to_list_item(product)),
            trending: trending.map((product) =>
                this.productsService.to_list_item(product),
            ),
            highest_rated: highest_rated.map((product) =>
                this.productsService.to_list_item(product),
            ),
            new_products: new_products.map((product) =>
                this.productsService.to_list_item(product),
            ),
            recommended: recommended.map((product) =>
                this.productsService.to_list_item(product),
            ),
            categories,
            ingredient_spotlight: ingredient_spotlight
                ? {
                      ingredient:
                          this.ingredientsService.to_public_entity(
                              ingredient_spotlight,
                          ),
                  }
                : null,
            daily_tip: getDailyTip(),
        };
    }

    private async getRecentScannedProducts(user_uuid: string) {
        const scans = await this.prisma.userProductScan.findMany({
            where: { user_uuid },
            take: RECENTLY_SCANNED_LIMIT,
            orderBy: { scanned_at: 'desc' },
            include: { product: { include: product_list_include } },
        });

        return scans.map((scan) => scan.product);
    }

    private async pickIngredientSpotlight() {
        const count = await this.prisma.ingredient.count();

        if (count === 0) {
            return null;
        }

        const day_of_year = Math.floor(
            (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
                86_400_000,
        );

        return this.prisma.ingredient.findFirst({
            skip: day_of_year % count,
            orderBy: { uuid: 'asc' },
        });
    }

    private async getOrSetCache<T>(
        key: string,
        factory: () => Promise<T>,
    ): Promise<T> {
        const cached = await this.cache.get<T>(key);

        if (cached !== undefined && cached !== null) {
            return cached;
        }

        const value = await factory();
        await this.cache.set(key, value, HOME_CACHE_TTL_MS);
        return value;
    }
}
