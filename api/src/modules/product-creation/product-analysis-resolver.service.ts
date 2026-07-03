import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AiService } from '@/integrations/ai/services/ai.service';
import { to_slug } from '@/shared/utils/slug.utils';
import { normalize_ingredient_name } from '@/shared/utils/ingredient.utils';
import { OcrResult } from '@/integrations/ocr/interfaces/ocr.interfaces';
import {
    PRODUCT_ANALYSIS_AI_VERSION,
    PRODUCT_ANALYSIS_SYSTEM_PROMPT,
    ProductAnalysisIngredientSchema,
    ProductAnalysisResult,
    ProductAnalysisSchema,
    buildProductAnalysisPrompt,
} from '@/integrations/ai/prompts/product-analysis';

export type TransactionClient = Prisma.TransactionClient;
export type ProductAnalysisIngredient = ReturnType<
    typeof ProductAnalysisIngredientSchema.parse
>;

const MAX_REFERENCE_INGREDIENTS = 1000;
const FALLBACK_CATEGORY_NAME = 'Other';
const FALLBACK_SUBCATEGORY_NAME = 'Other';

/**
 * Shared AI-analysis + taxonomy-resolution logic used by both the initial
 * product creation pipeline (Feature 07) and admin-triggered reanalysis
 * (Feature 12). Callers own the final write (create vs. update the Product
 * row) — this service only resolves brand/subcategory/ingredient uuids and
 * runs the AI prompt.
 */
@Injectable()
export class ProductAnalysisResolverService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly aiService: AiService,
    ) {}

    async generateAnalysis(
        ocr_result: OcrResult,
        barcode: string | null,
    ): Promise<ProductAnalysisResult> {
        const [categories, brands, ingredients] = await Promise.all([
            this.prisma.category.findMany({
                orderBy: { sort_order: 'asc' },
                include: { subcategories: { orderBy: { sort_order: 'asc' } } },
            }),
            this.prisma.brand.findMany({ orderBy: { name: 'asc' } }),
            this.prisma.ingredient.findMany({
                take: MAX_REFERENCE_INGREDIENTS,
                orderBy: { name: 'asc' },
                select: { uuid: true, name: true, synonyms: true },
            }),
        ]);

        const prompt = buildProductAnalysisPrompt({
            ocr_result,
            barcode,
            categories: categories.map((category) => ({
                uuid: category.uuid,
                name: category.name,
                subcategories: category.subcategories.map((sub) => ({
                    uuid: sub.uuid,
                    name: sub.name,
                })),
            })),
            brands: brands.map((brand) => ({
                uuid: brand.uuid,
                name: brand.name,
            })),
            ingredients,
        });

        const { response } = await this.aiService.generateTextWithSchema({
            system: PRODUCT_ANALYSIS_SYSTEM_PROMPT,
            prompt,
            schema: ProductAnalysisSchema,
        });

        const parsed = ProductAnalysisSchema.safeParse(response);

        if (!parsed.success) {
            throw new Error(
                `AI response failed schema validation: ${parsed.error.message}`,
            );
        }

        const ingredients = parsed.data.ingredients.filter(
            (ingredient) =>
                ingredient.overall_score !== null ||
                ingredient.matched_ingredient_uuid !== null,
        );

        if (ingredients.length === 0) {
            throw new Error(
                'AI response contained no scorable ingredients after filtering OCR noise',
            );
        }

        return { ...parsed.data, ingredients };
    }

    async resolveBrand(
        tx: TransactionClient,
        analysis: ProductAnalysisResult,
    ): Promise<string> {
        if (analysis.matched_brand_uuid) {
            const existing = await tx.brand.findUnique({
                where: { uuid: analysis.matched_brand_uuid },
            });

            if (existing) {
                return existing.uuid;
            }
        }

        const name = analysis.brand_name.trim();
        const existing_by_name = await tx.brand.findUnique({ where: { name } });

        if (existing_by_name) {
            return existing_by_name.uuid;
        }

        const slug = await this.uniqueSlug(name, async (candidate) =>
            Boolean(await tx.brand.findUnique({ where: { slug: candidate } })),
        );

        const brand = await tx.brand.create({
            data: { name, slug },
        });

        return brand.uuid;
    }

    async resolveSubcategory(
        tx: TransactionClient,
        analysis: ProductAnalysisResult,
    ): Promise<string> {
        if (analysis.matched_subcategory_uuid) {
            const existing = await tx.subcategory.findUnique({
                where: { uuid: analysis.matched_subcategory_uuid },
            });

            if (existing) {
                return existing.uuid;
            }
        }

        const category_uuid = await this.resolveCategory(tx, analysis);

        // Use the AI-proposed subcategory name when available, otherwise attach
        // the product to an "Other" subcategory under the resolved category so
        // the job still succeeds and lands in the review queue.
        const subcategory_name =
            analysis.new_subcategory_name?.trim() || FALLBACK_SUBCATEGORY_NAME;

        return this.findOrCreateSubcategory(tx, category_uuid, subcategory_name);
    }

    private async resolveCategory(
        tx: TransactionClient,
        analysis: ProductAnalysisResult,
    ): Promise<string> {
        if (analysis.matched_category_uuid) {
            const existing = await tx.category.findUnique({
                where: { uuid: analysis.matched_category_uuid },
            });

            if (existing) {
                return existing.uuid;
            }
        }

        // The AI decided none of the existing categories fit — create the new
        // top-level category it proposed and persist it to our taxonomy.
        if (analysis.new_category_name) {
            return this.findOrCreateCategory(tx, analysis.new_category_name);
        }

        // Last resort: the AI resolved nothing usable (e.g. garbled OCR). Fall
        // back to a shared "Other" category so the job never hard-fails.
        return this.findOrCreateCategory(tx, FALLBACK_CATEGORY_NAME);
    }

    private async findOrCreateSubcategory(
        tx: TransactionClient,
        category_uuid: string,
        raw_name: string,
    ): Promise<string> {
        const name = raw_name.trim();
        const existing_by_name = await tx.subcategory.findFirst({
            where: { category_uuid, name },
        });

        if (existing_by_name) {
            return existing_by_name.uuid;
        }

        const slug = await this.uniqueSlug(name, async (candidate) =>
            Boolean(
                await tx.subcategory.findFirst({
                    where: { category_uuid, slug: candidate },
                }),
            ),
        );

        const subcategory = await tx.subcategory.create({
            data: { category_uuid, name, slug },
        });

        return subcategory.uuid;
    }

    private async findOrCreateCategory(
        tx: TransactionClient,
        raw_name: string,
    ): Promise<string> {
        const name = raw_name.trim();
        const existing = await tx.category.findUnique({ where: { name } });

        if (existing) {
            return existing.uuid;
        }

        const slug = await this.uniqueSlug(name, async (candidate) =>
            Boolean(await tx.category.findUnique({ where: { slug: candidate } })),
        );

        const category = await tx.category.create({
            data: { name, slug },
        });

        return category.uuid;
    }

    async resolveIngredients(
        tx: TransactionClient,
        ingredients: ProductAnalysisIngredient[],
    ): Promise<string[]> {
        const resolved: string[] = [];
        const seen_in_run = new Map<string, string>();

        for (const item of ingredients) {
            const name_normalized = normalize_ingredient_name(item.name);

            if (seen_in_run.has(name_normalized)) {
                resolved.push(seen_in_run.get(name_normalized) as string);
                continue;
            }

            const uuid = await this.resolveSingleIngredient(
                tx,
                item,
                name_normalized,
            );

            seen_in_run.set(name_normalized, uuid);
            resolved.push(uuid);
        }

        return resolved;
    }

    private async resolveSingleIngredient(
        tx: TransactionClient,
        item: ProductAnalysisIngredient,
        name_normalized: string,
    ): Promise<string> {
        if (item.matched_ingredient_uuid) {
            const existing = await tx.ingredient.findUnique({
                where: { uuid: item.matched_ingredient_uuid },
            });

            if (existing) {
                return existing.uuid;
            }
        }

        const existing_by_name = await tx.ingredient.findUnique({
            where: { name_normalized },
        });

        if (existing_by_name) {
            return existing_by_name.uuid;
        }

        const created = await tx.ingredient.create({
            data: {
                name: item.name.trim(),
                name_normalized,
                scientific_name: item.scientific_name,
                ai_summary: item.ai_summary,
                full_description: item.full_description,
                benefits: item.benefits,
                risks: item.risks,
                safety_explanation: item.safety_explanation,
                purpose: item.purpose,
                common_uses: item.common_uses,
                pregnancy_safety: item.pregnancy_safety,
                child_safety: item.child_safety,
                allergy_risk: item.allergy_risk,
                carcinogenic_evidence: item.carcinogenic_evidence,
                hormone_disruption_risk: item.hormone_disruption_risk,
                irritation_risk: item.irritation_risk,
                acne_rating: item.acne_rating,
                comedogenic_rating: item.comedogenic_rating,
                sensitive_skin_suitability: item.sensitive_skin_suitability,
                environmental_impact: item.environmental_impact,
                is_vegan: item.is_vegan,
                is_cruelty_free: item.is_cruelty_free,
                is_biodegradable: item.is_biodegradable,
                overall_score: item.overall_score,
                safety_score: item.safety_score,
                risk_score: item.risk_score,
                confidence_score: item.confidence_score,
                color_indicator: item.color_indicator,
                research_summary: item.research_summary,
                ai_version: PRODUCT_ANALYSIS_AI_VERSION,
            },
        });

        return created.uuid;
    }

    async uniqueSlug(
        name: string,
        exists: (candidate: string) => Promise<boolean>,
    ): Promise<string> {
        const base = to_slug(name) || 'item';
        let candidate = base;
        let attempt = 1;

        while (await exists(candidate)) {
            attempt += 1;
            candidate = `${base}-${attempt}`;
        }

        return candidate;
    }
}
