import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ProductsService } from '@/modules/products/products.service';
import { CreateScanDto } from './dto/create-scan.dto';
import {
    RecentScansQueryType,
    ScanQueryType,
} from './dto/scan-query.schema';
import { ScanEntity } from './entities/scan.entity';

const scan_product_include = {
    brand: true,
    images: {
        orderBy: { sort_order: 'asc' as const },
    },
} as const;

@Injectable()
export class ScansService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly products_service: ProductsService,
    ) {}

    async create(user_uuid: string, dto: CreateScanDto): Promise<ScanEntity> {
        const product = await this.prisma.product.findFirst({
            where: {
                uuid: dto.product_uuid,
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const existing_scan = await this.prisma.userProductScan.findUnique({
            where: {
                user_uuid_product_uuid: {
                    user_uuid,
                    product_uuid: dto.product_uuid,
                },
            },
        });

        const scan = await this.prisma.$transaction(async (tx) => {
            if (!existing_scan) {
                await tx.product.update({
                    where: { uuid: dto.product_uuid },
                    data: { scan_count: { increment: 1 } },
                });
            }

            return tx.userProductScan.upsert({
                where: {
                    user_uuid_product_uuid: {
                        user_uuid,
                        product_uuid: dto.product_uuid,
                    },
                },
                create: {
                    user_uuid,
                    product_uuid: dto.product_uuid,
                    scan_method: dto.scan_method,
                },
                update: {
                    scanned_at: new Date(),
                    scan_method: dto.scan_method,
                },
                include: {
                    product: {
                        include: scan_product_include,
                    },
                },
            });
        });

        return this.to_scan_entity(scan);
    }

    async find_all(user_uuid: string, query: ScanQueryType) {
        const where = { user_uuid };

        const [items, count] = await Promise.all([
            this.prisma.userProductScan.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { scanned_at: 'desc' },
                include: {
                    product: {
                        include: scan_product_include,
                    },
                },
            }),
            this.prisma.userProductScan.count({ where }),
        ]);

        const total_pages = Math.ceil(count / query.limit);

        return {
            data: items.map((scan) => this.to_scan_entity(scan)),
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

    async find_recent(user_uuid: string, query: RecentScansQueryType) {
        const items = await this.prisma.userProductScan.findMany({
            where: { user_uuid },
            take: query.limit,
            orderBy: { scanned_at: 'desc' },
            include: {
                product: {
                    include: scan_product_include,
                },
            },
        });

        return items.map((scan) => this.to_scan_entity(scan));
    }

    private to_scan_entity(scan: {
        uuid: string;
        scanned_at: Date;
        scan_method: ScanEntity['scan_method'];
        product: Parameters<ProductsService['to_list_item']>[0];
    }): ScanEntity {
        return {
            uuid: scan.uuid,
            scanned_at: scan.scanned_at,
            scan_method: scan.scan_method,
            product: this.products_service.to_list_item(
                scan.product as Parameters<ProductsService['to_list_item']>[0],
            ),
        };
    }
}
