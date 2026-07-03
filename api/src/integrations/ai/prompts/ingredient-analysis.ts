import { z } from 'zod';
import { ProductAnalysisIngredientSchema } from './product-analysis';

export const INGREDIENT_REANALYSIS_AI_VERSION = 'ingredient-analysis-v1';

export const INGREDIENT_REANALYSIS_SYSTEM_PROMPT =
    'You are a cosmetic and food ingredient safety analyst for the Toxity app. ' +
    'You produce a structured, evidence-based safety analysis for a single named ' +
    'ingredient. Scores use a 0-20 scale where 20 is safest. Be concise and factual.';

export const IngredientReanalysisSchema = ProductAnalysisIngredientSchema.omit({
    matched_ingredient_uuid: true,
}).extend({
    overall_score: z.number().min(0).max(20),
});

export type IngredientReanalysisResult = z.infer<
    typeof IngredientReanalysisSchema
>;

export function buildIngredientReanalysisPrompt(ingredient: {
    name: string;
    synonyms: string[];
}): string {
    const synonyms_line = ingredient.synonyms.length
        ? ` (also known as: ${ingredient.synonyms.join(', ')})`
        : '';

    return `Provide a complete, up-to-date safety analysis for the ingredient "${ingredient.name}"${synonyms_line}.

Return every field in the schema. Use null only when there is genuinely not enough
evidence to determine a value. overall_score and related scores use a 0-20 scale
(20 = safest, 0 = most concerning). color_indicator must reflect the score:
VERY_SAFE (>=17), SAFE (>=13), MODERATE (>=9), CAUTION (>=5), HIGH_RISK (<5), or
UNKNOWN if there is not enough information.`;
}
