import { z } from 'zod';

export const BrandQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 20)),
    search: z.string().optional(),
});

export type BrandQueryType = z.infer<typeof BrandQuerySchema>;
