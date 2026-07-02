import { z } from 'zod';

export const CategoryProductsQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 20)),
});

export type CategoryProductsQueryType = z.infer<typeof CategoryProductsQuerySchema>;
