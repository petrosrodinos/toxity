import { z } from 'zod';

const color_indicators = [
    'VERY_SAFE',
    'SAFE',
    'MODERATE',
    'CAUTION',
    'HIGH_RISK',
    'UNKNOWN',
] as const;

export const IngredientQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 20)),
    search: z.string().optional(),
    color_indicator: z.enum(color_indicators).optional(),
});

export type IngredientQueryType = z.infer<typeof IngredientQuerySchema>;
