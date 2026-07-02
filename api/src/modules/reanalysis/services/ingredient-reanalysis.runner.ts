import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AiService } from '@/integrations/ai/services/ai.service';
import {
    INGREDIENT_REANALYSIS_AI_VERSION,
    INGREDIENT_REANALYSIS_SYSTEM_PROMPT,
    IngredientReanalysisSchema,
    buildIngredientReanalysisPrompt,
} from '@/integrations/ai/prompts/ingredient-analysis';

@Injectable()
export class IngredientReanalysisRunner {
    private readonly logger = new Logger(IngredientReanalysisRunner.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly aiService: AiService,
    ) {}

    async run(ingredient_uuid: string): Promise<void> {
        try {
            const ingredient = await this.prisma.ingredient.findUnique({
                where: { uuid: ingredient_uuid },
            });

            if (!ingredient) {
                throw new NotFoundException('Ingredient not found');
            }

            await this.snapshot(ingredient);

            const prompt = buildIngredientReanalysisPrompt({
                name: ingredient.name,
                synonyms: ingredient.synonyms,
            });

            const { response } = await this.aiService.generateTextWithSchema({
                system: INGREDIENT_REANALYSIS_SYSTEM_PROMPT,
                prompt,
                schema: IngredientReanalysisSchema,
            });

            const parsed = IngredientReanalysisSchema.safeParse(response);

            if (!parsed.success) {
                throw new Error(
                    `AI response failed schema validation: ${parsed.error.message}`,
                );
            }

            const analysis = parsed.data;

            await this.prisma.ingredient.update({
                where: { uuid: ingredient_uuid },
                data: {
                    scientific_name: analysis.scientific_name,
                    ai_summary: analysis.ai_summary,
                    full_description: analysis.full_description,
                    benefits: analysis.benefits,
                    risks: analysis.risks,
                    safety_explanation: analysis.safety_explanation,
                    purpose: analysis.purpose,
                    common_uses: analysis.common_uses,
                    pregnancy_safety: analysis.pregnancy_safety,
                    child_safety: analysis.child_safety,
                    allergy_risk: analysis.allergy_risk,
                    carcinogenic_evidence: analysis.carcinogenic_evidence,
                    hormone_disruption_risk: analysis.hormone_disruption_risk,
                    irritation_risk: analysis.irritation_risk,
                    acne_rating: analysis.acne_rating,
                    comedogenic_rating: analysis.comedogenic_rating,
                    sensitive_skin_suitability: analysis.sensitive_skin_suitability,
                    environmental_impact: analysis.environmental_impact,
                    is_vegan: analysis.is_vegan,
                    is_cruelty_free: analysis.is_cruelty_free,
                    is_biodegradable: analysis.is_biodegradable,
                    overall_score: analysis.overall_score,
                    safety_score: analysis.safety_score,
                    risk_score: analysis.risk_score,
                    confidence_score: analysis.confidence_score,
                    color_indicator: analysis.color_indicator,
                    research_summary: analysis.research_summary,
                    ai_version: INGREDIENT_REANALYSIS_AI_VERSION,
                },
            });
        } catch (error) {
            this.logger.error(
                `Ingredient reanalysis failed for ${ingredient_uuid}: ${error.message}`,
                error.stack,
            );
        }
    }

    private async snapshot(
        ingredient: Prisma.IngredientGetPayload<object>,
    ): Promise<void> {
        const snapshot = {
            name: ingredient.name,
            scientific_name: ingredient.scientific_name,
            ai_summary: ingredient.ai_summary,
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
            sensitive_skin_suitability: ingredient.sensitive_skin_suitability,
            environmental_impact: ingredient.environmental_impact,
            is_vegan: ingredient.is_vegan,
            is_cruelty_free: ingredient.is_cruelty_free,
            is_biodegradable: ingredient.is_biodegradable,
            overall_score: ingredient.overall_score?.toString() ?? null,
            safety_score: ingredient.safety_score?.toString() ?? null,
            risk_score: ingredient.risk_score?.toString() ?? null,
            confidence_score: ingredient.confidence_score?.toString() ?? null,
            color_indicator: ingredient.color_indicator,
            research_summary: ingredient.research_summary,
        };

        await this.prisma.ingredientAnalysisVersion.create({
            data: {
                ingredient_uuid: ingredient.uuid,
                ai_version: ingredient.ai_version,
                snapshot: snapshot as unknown as Prisma.InputJsonValue,
            },
        });
    }
}
