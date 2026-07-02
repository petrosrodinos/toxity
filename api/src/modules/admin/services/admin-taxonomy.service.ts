import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { to_slug } from '@/shared/utils/slug.utils';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-subcategory.dto';

@Injectable()
export class AdminTaxonomyService {
    constructor(private readonly prisma: PrismaService) {}

    async createCategory(dto: CreateCategoryDto) {
        const slug = to_slug(dto.name);
        const existing = await this.prisma.category.findFirst({
            where: { OR: [{ name: dto.name }, { slug }] },
        });

        if (existing) {
            throw new ConflictException('Category already exists');
        }

        return this.prisma.category.create({
            data: {
                name: dto.name,
                slug,
                icon_url: dto.icon_url,
                sort_order: dto.sort_order ?? 0,
            },
        });
    }

    async updateCategory(category_uuid: string, dto: UpdateCategoryDto) {
        await this.getCategoryOrThrow(category_uuid);

        return this.prisma.category.update({
            where: { uuid: category_uuid },
            data: {
                ...(dto.name && { name: dto.name, slug: to_slug(dto.name) }),
                ...(dto.icon_url !== undefined && { icon_url: dto.icon_url }),
                ...(dto.sort_order !== undefined && { sort_order: dto.sort_order }),
            },
        });
    }

    async removeCategory(category_uuid: string): Promise<void> {
        await this.getCategoryOrThrow(category_uuid);
        await this.prisma.category.delete({ where: { uuid: category_uuid } });
    }

    async createSubcategory(dto: CreateSubcategoryDto) {
        await this.getCategoryOrThrow(dto.category_uuid);

        const slug = to_slug(dto.name);
        const existing = await this.prisma.subcategory.findFirst({
            where: {
                category_uuid: dto.category_uuid,
                OR: [{ name: dto.name }, { slug }],
            },
        });

        if (existing) {
            throw new ConflictException(
                'Subcategory already exists in this category',
            );
        }

        return this.prisma.subcategory.create({
            data: {
                category_uuid: dto.category_uuid,
                name: dto.name,
                slug,
                sort_order: dto.sort_order ?? 0,
            },
        });
    }

    async updateSubcategory(
        subcategory_uuid: string,
        dto: UpdateSubcategoryDto,
    ) {
        const subcategory = await this.getSubcategoryOrThrow(subcategory_uuid);
        const category_uuid = dto.category_uuid ?? subcategory.category_uuid;

        if (dto.category_uuid) {
            await this.getCategoryOrThrow(dto.category_uuid);
        }

        return this.prisma.subcategory.update({
            where: { uuid: subcategory_uuid },
            data: {
                ...(dto.category_uuid && { category_uuid }),
                ...(dto.name && { name: dto.name, slug: to_slug(dto.name) }),
                ...(dto.sort_order !== undefined && { sort_order: dto.sort_order }),
            },
        });
    }

    async removeSubcategory(subcategory_uuid: string): Promise<void> {
        await this.getSubcategoryOrThrow(subcategory_uuid);
        await this.prisma.subcategory.delete({ where: { uuid: subcategory_uuid } });
    }

    private async getCategoryOrThrow(category_uuid: string) {
        const category = await this.prisma.category.findUnique({
            where: { uuid: category_uuid },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    private async getSubcategoryOrThrow(subcategory_uuid: string) {
        const subcategory = await this.prisma.subcategory.findUnique({
            where: { uuid: subcategory_uuid },
        });

        if (!subcategory) {
            throw new NotFoundException('Subcategory not found');
        }

        return subcategory;
    }
}
