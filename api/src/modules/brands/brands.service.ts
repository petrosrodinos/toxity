import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { BrandQueryType } from './dto/brand-query.schema';
import { BrandDetailEntity, BrandEntity } from './entities/brand.entity';

@Injectable()
export class BrandsService {
    constructor(private readonly prisma: PrismaService) {}

    async find_all(query: BrandQueryType) {
        const where = query.search
            ? {
                  name: {
                      contains: query.search,
                      mode: 'insensitive' as const,
                  },
              }
            : {};

        const [items, count] = await Promise.all([
            this.prisma.brand.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.brand.count({ where }),
        ]);

        const total_pages = Math.ceil(count / query.limit);

        return {
            data: items.map((brand) => this.to_brand_entity(brand)),
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

    async find_one(brand_uuid: string): Promise<BrandDetailEntity> {
        const brand = await this.prisma.brand.findUnique({
            where: { uuid: brand_uuid },
        });

        if (!brand) {
            throw new NotFoundException('Brand not found');
        }

        // Product model arrives in Feature 05 — count stays 0 until then.
        return {
            ...this.to_brand_entity(brand),
            product_count: 0,
        };
    }

    private to_brand_entity(brand: {
        uuid: string;
        name: string;
        slug: string;
        logo_url: string | null;
        website: string | null;
        country: string | null;
        description: string | null;
    }): BrandEntity {
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
