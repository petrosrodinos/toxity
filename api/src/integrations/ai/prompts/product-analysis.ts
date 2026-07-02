import { z } from 'zod';
import { ColorIndicator, SafetyLevel } from 'generated/prisma';
import { OcrResult } from '@/integrations/ocr/interfaces/ocr.interfaces';

export const PRODUCT_ANALYSIS_AI_VERSION = 'product-analysis-v1';

export const PRODUCT_ANALYSIS_SYSTEM_PROMPT =
    'You are a cosmetic and food product safety analyst for the Toxity app. ' +
    'You analyze OCR-extracted product labels and produce a structured safety analysis. ' +
    'You must reuse existing brands, categories/subcategories, and ingredients whenever a ' +
    'clear match exists instead of creating duplicates. Only propose new records when nothing ' +
    'in the provided reference lists reasonably matches. Scores use a 0-20 scale where 20 is ' +
    'safest. Be evidence-based and concise.';

export const ProductAnalysisIngredientSchema = z.object({
    name: z.string().min(1),
    matched_ingredient_uuid: z
        .string()
        .nullable()
        .describe(
            'UUID of an existing ingredient from the reference list if this ingredient matches one, otherwise null',
        ),
    scientific_name: z.string().nullable(),
    ai_summary: z.string().nullable(),
    full_description: z.string().nullable(),
    benefits: z.string().nullable(),
    risks: z.string().nullable(),
    safety_explanation: z.string().nullable(),
    purpose: z.string().nullable(),
    common_uses: z.string().nullable(),
    pregnancy_safety: z.nativeEnum(SafetyLevel).nullable(),
    child_safety: z.nativeEnum(SafetyLevel).nullable(),
    allergy_risk: z.string().nullable(),
    carcinogenic_evidence: z.string().nullable(),
    hormone_disruption_risk: z.string().nullable(),
    irritation_risk: z.string().nullable(),
    acne_rating: z.number().int().min(0).max(5).nullable(),
    comedogenic_rating: z.number().int().min(0).max(5).nullable(),
    sensitive_skin_suitability: z.nativeEnum(SafetyLevel).nullable(),
    environmental_impact: z.string().nullable(),
    is_vegan: z.boolean().nullable(),
    is_cruelty_free: z.boolean().nullable(),
    is_biodegradable: z.boolean().nullable(),
    overall_score: z.number().min(0).max(20),
    safety_score: z.number().min(0).max(20).nullable(),
    risk_score: z.number().min(0).max(20).nullable(),
    confidence_score: z.number().min(0).max(20).nullable(),
    color_indicator: z.nativeEnum(ColorIndicator),
    research_summary: z.string().nullable(),
});

export const ProductAnalysisFaqItemSchema = z.object({
    question: z.string(),
    answer: z.string(),
});

export const ProductAnalysisSchema = z.object({
    product_name: z.string().min(1),
    brand_name: z.string().min(1),
    matched_brand_uuid: z
        .string()
        .nullable()
        .describe(
            'UUID of an existing brand from the reference list if the brand matches one, otherwise null',
        ),
    matched_subcategory_uuid: z
        .string()
        .nullable()
        .describe(
            'UUID of an existing subcategory from the reference list that best fits this product, if any',
        ),
    matched_category_uuid: z
        .string()
        .nullable()
        .describe(
            'UUID of the existing top-level category to attach a new subcategory to, when matched_subcategory_uuid is null',
        ),
    new_subcategory_name: z
        .string()
        .nullable()
        .describe(
            'Name for a new subcategory when no existing subcategory fits; must be paired with matched_category_uuid',
        ),
    description: z.string().nullable(),
    ai_summary: z.string().nullable(),
    benefits: z.string().nullable(),
    risks: z.string().nullable(),
    warnings: z.string().nullable(),
    suitability: z.string().nullable(),
    recommended_usage: z.string().nullable(),
    storage_info: z.string().nullable(),
    pregnancy_safety: z.nativeEnum(SafetyLevel).nullable(),
    children_safety: z.nativeEnum(SafetyLevel).nullable(),
    sensitive_skin_safety: z.nativeEnum(SafetyLevel).nullable(),
    allergy_warnings: z.string().nullable(),
    environmental_impact: z.string().nullable(),
    is_vegan: z.boolean().nullable(),
    is_cruelty_free: z.boolean().nullable(),
    overall_score: z.number().min(0).max(20),
    color_indicator: z.nativeEnum(ColorIndicator),
    scientific_confidence: z.number().min(0).max(20).nullable(),
    package_size: z.string().nullable(),
    faq: z.array(ProductAnalysisFaqItemSchema).nullable(),
    ingredients: z.array(ProductAnalysisIngredientSchema).min(1),
});

export type ProductAnalysisResult = z.infer<typeof ProductAnalysisSchema>;

export interface ProductAnalysisReferenceData {
    ocr_result: OcrResult;
    barcode: string | null;
    categories: {
        uuid: string;
        name: string;
        subcategories: { uuid: string; name: string }[];
    }[];
    brands: { uuid: string; name: string }[];
    ingredients: { uuid: string; name: string; synonyms: string[] }[];
}

export function buildProductAnalysisPrompt(
    data: ProductAnalysisReferenceData,
): string {
    const category_lines = data.categories
        .map(
            (category) =>
                `- ${category.name} (uuid: ${category.uuid}) > subcategories: ${category.subcategories
                    .map((sub) => `${sub.name} (uuid: ${sub.uuid})`)
                    .join(', ') || 'none'}`,
        )
        .join('\n');

    const brand_lines = data.brands
        .map((brand) => `- ${brand.name} (uuid: ${brand.uuid})`)
        .join('\n');

    const ingredient_lines = data.ingredients
        .map((ingredient) => {
            const synonyms = ingredient.synonyms.length
                ? ` [synonyms: ${ingredient.synonyms.join(', ')}]`
                : '';
            return `- ${ingredient.name} (uuid: ${ingredient.uuid})${synonyms}`;
        })
        .join('\n');

    return `Analyze this product label data and return a complete structured product analysis.

## OCR-extracted label data
Product name (guess): ${data.ocr_result.name ?? 'unknown'}
Brand (guess): ${data.ocr_result.brand ?? 'unknown'}
Barcode: ${data.barcode ?? 'none'}
Marketing claims found on label: ${data.ocr_result.claims.join(', ') || 'none'}
Ingredient list (raw OCR order):
${data.ocr_result.ingredients.map((name, index) => `${index + 1}. ${name}`).join('\n')}

## Existing categories and subcategories (reuse when possible)
${category_lines || 'none available'}

## Existing brands (reuse when possible)
${brand_lines || 'none available'}

## Existing ingredients (reuse when possible, matching by name or synonym)
${ingredient_lines || 'none available'}

## Instructions
- For the brand: if it matches an existing brand (case-insensitive, allowing minor spelling variation), set matched_brand_uuid to that brand's uuid. Otherwise set matched_brand_uuid to null and provide brand_name.
- For the category: prefer matched_subcategory_uuid from the existing list. Only if truly nothing fits, pick the closest matched_category_uuid and provide new_subcategory_name to create a subcategory under it.
- For each ingredient in the OCR list: if it matches an existing ingredient (by name or synonym, allowing spelling/case variation and INCI naming), set matched_ingredient_uuid to that ingredient's uuid and still fill in its analysis fields. Otherwise set matched_ingredient_uuid to null and provide full analysis.
- Preserve the ingredient order from the OCR list in your response.
- overall_score and ingredient overall_score use a 0-20 scale (20 = safest, 0 = most concerning).
- color_indicator must reflect the score: VERY_SAFE (>=17), SAFE (>=13), MODERATE (>=9), CAUTION (>=5), HIGH_RISK (<5), or UNKNOWN if there is not enough information.
- Return null for any field you cannot determine confidently, except required fields.`;
}
