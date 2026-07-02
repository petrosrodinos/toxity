import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { normalize_ingredient_name } from '@/shared/utils/ingredient.utils';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { IngredientQueryType } from './dto/ingredient-query.schema';
import {
    IngredientEntity,
    IngredientListItemEntity,
} from './entities/ingredient.entity';

type IngredientRecord = Prisma.IngredientGetPayload<object>;

@Injectable()
export class IngredientsService {
    constructor(private readonly prisma: PrismaService) {}

    async find_all(query: IngredientQueryType) {
        const search_filter = query.search
            ? {
                  OR: [
                      {
                          name: {
                              contains: query.search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          name_normalized: {
                              contains: normalize_ingredient_name(
                                  query.search,
                              ),
                          },
                      },
                      {
                          synonyms: {
                              has: query.search,
                          },
                      },
                  ],
              }
            : {};

        const where = {
            ...search_filter,
            ...(query.color_indicator && {
                color_indicator: query.color_indicator,
            }),
        };

        const [items, count] = await Promise.all([
            this.prisma.ingredient.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.ingredient.count({ where }),
        ]);

        const total_pages = Math.ceil(count / query.limit);

        return {
            data: items.map((ingredient) =>
                this.to_list_item(ingredient),
            ),
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

    async find_one(ingredient_uuid: string): Promise<IngredientEntity> {
        const ingredient = await this.prisma.ingredient.findUnique({
            where: { uuid: ingredient_uuid },
        });

        if (!ingredient) {
            throw new NotFoundException('Ingredient not found');
        }

        return this.to_entity(ingredient);
    }

    async create(dto: CreateIngredientDto): Promise<IngredientEntity> {
        const name_normalized = normalize_ingredient_name(dto.name);

        const existing = await this.prisma.ingredient.findUnique({
            where: { name_normalized },
        });

        if (existing) {
            throw new ConflictException('Ingredient already exists');
        }

        const ingredient = await this.prisma.ingredient.create({
            data: {
                name: dto.name.trim(),
                name_normalized,
                synonyms: dto.synonyms ?? [],
                scientific_name: dto.scientific_name,
                description: dto.description,
                ai_summary: dto.ai_summary,
                benefits: dto.benefits,
                risks: dto.risks,
                purpose: dto.purpose,
                pregnancy_safety: dto.pregnancy_safety,
                color_indicator: dto.color_indicator,
                overall_score: dto.overall_score,
                safety_score: dto.safety_score,
                is_vegan: dto.is_vegan,
                is_cruelty_free: dto.is_cruelty_free,
                acne_rating: dto.acne_rating,
                comedogenic_rating: dto.comedogenic_rating,
            },
        });

        return this.to_entity(ingredient);
    }

    to_public_entity(ingredient: IngredientRecord): IngredientEntity {
        return this.to_entity(ingredient);
    }

    private to_list_item(
        ingredient: IngredientRecord,
    ): IngredientListItemEntity {
        return {
            uuid: ingredient.uuid,
            name: ingredient.name,
            color_indicator: ingredient.color_indicator,
            overall_score: ingredient.overall_score?.toString() ?? null,
            ai_summary: ingredient.ai_summary,
            synonyms: ingredient.synonyms,
        };
    }

    private to_entity(ingredient: IngredientRecord): IngredientEntity {
        return {
            ...this.to_list_item(ingredient),
            scientific_name: ingredient.scientific_name,
            description: ingredient.description,
            full_description: ingredient.full_description,
            benefits: ingredient.benefits,
            risks: ingredient.risks,
            safety_explanation: ingredient.safety_explanation,
            purpose: ingredient.purpose,
            common_uses: ingredient.common_uses,
            pregnancy_safety: ingredient.pregnancy_safety,
            child_safety: ingredient.child_safety,
            allergy_risk: ingredient.allergy_risk,
            carcinogenic_evidence: ingredient.carcinogenic_evidence,
            hormone_disruption_risk: ingredient.hormone_disruption_risk,
            irritation_risk: ingredient.irritation_risk,
            acne_rating: ingredient.acne_rating,
            comedogenic_rating: ingredient.comedogenic_rating,
            sensitive_skin_suitability:
                ingredient.sensitive_skin_suitability,
            environmental_impact: ingredient.environmental_impact,
            is_vegan: ingredient.is_vegan,
            is_cruelty_free: ingredient.is_cruelty_free,
            is_biodegradable: ingredient.is_biodegradable,
            safety_score: ingredient.safety_score?.toString() ?? null,
            risk_score: ingredient.risk_score?.toString() ?? null,
            confidence_score:
                ingredient.confidence_score?.toString() ?? null,
            research_summary: ingredient.research_summary,
            references: (ingredient.references as unknown as
                IngredientEntity['references']) ?? null,
            ai_version: ingredient.ai_version,
            created_at: ingredient.created_at,
            updated_at: ingredient.updated_at,
        };
    }
}
