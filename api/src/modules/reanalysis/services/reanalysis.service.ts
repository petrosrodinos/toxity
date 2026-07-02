import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ProductReanalysisRunner } from './product-reanalysis.runner';
import { IngredientReanalysisRunner } from './ingredient-reanalysis.runner';
import { PaginationQueryType } from '@/modules/admin/dto/pagination-query.schema';

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

@Injectable()
export class ReanalysisService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly productReanalysisRunner: ProductReanalysisRunner,
        private readonly ingredientReanalysisRunner: IngredientReanalysisRunner,
    ) {}

    async triggerProductReanalysis(
        product_uuid: string,
    ): Promise<{ status: 'ANALYZING' }> {
        const product = await this.prisma.product.findUnique({
            where: { uuid: product_uuid },
            select: { uuid: true },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const last_version = await this.prisma.productAnalysisVersion.findFirst({
            where: { product_uuid },
            orderBy: { created_at: 'desc' },
            select: { created_at: true },
        });

        this.assertNotRateLimited(last_version?.created_at);

        setImmediate(() => {
            this.productReanalysisRunner.run(product_uuid).catch(() => {});
        });

        return { status: 'ANALYZING' };
    }

    async triggerIngredientReanalysis(
        ingredient_uuid: string,
    ): Promise<{ status: 'ANALYZING' }> {
        const ingredient = await this.prisma.ingredient.findUnique({
            where: { uuid: ingredient_uuid },
            select: { uuid: true },
        });

        if (!ingredient) {
            throw new NotFoundException('Ingredient not found');
        }

        const last_version = await this.prisma.ingredientAnalysisVersion.findFirst(
            {
                where: { ingredient_uuid },
                orderBy: { created_at: 'desc' },
                select: { created_at: true },
            },
        );

        this.assertNotRateLimited(last_version?.created_at);

        setImmediate(() => {
            this.ingredientReanalysisRunner.run(ingredient_uuid).catch(() => {});
        });

        return { status: 'ANALYZING' };
    }

    async getProductVersions(
        product_uuid: string,
        query: PaginationQueryType,
    ) {
        const where = { product_uuid };

        const [items, count] = await Promise.all([
            this.prisma.productAnalysisVersion.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.productAnalysisVersion.count({ where }),
        ]);

        return this.toPaginated(items, count, query);
    }

    async getIngredientVersions(
        ingredient_uuid: string,
        query: PaginationQueryType,
    ) {
        const where = { ingredient_uuid };

        const [items, count] = await Promise.all([
            this.prisma.ingredientAnalysisVersion.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.ingredientAnalysisVersion.count({ where }),
        ]);

        return this.toPaginated(items, count, query);
    }

    private assertNotRateLimited(last_run_at: Date | undefined): void {
        if (!last_run_at) return;

        const elapsed_ms = Date.now() - last_run_at.getTime();

        if (elapsed_ms < RATE_LIMIT_WINDOW_MS) {
            const minutes_left = Math.ceil(
                (RATE_LIMIT_WINDOW_MS - elapsed_ms) / 60_000,
            );
            throw new BadRequestException(
                `Reanalysis was run recently. Try again in ${minutes_left} minute${minutes_left === 1 ? '' : 's'}.`,
            );
        }
    }

    private toPaginated<T>(items: T[], count: number, query: PaginationQueryType) {
        const total_pages = Math.ceil(count / query.limit);

        return {
            data: items,
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
