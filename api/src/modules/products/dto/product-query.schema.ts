import { z } from 'zod';

const sort_options = [
    'highest_rated',
    'lowest_rated',
    'newest',
    'most_popular',
] as const;

export const ProductQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 20)),
    featured: z
        .string()
        .optional()
        .transform((v) => v === 'true'),
    category_uuid: z.string().uuid().optional(),
    subcategory_uuid: z.string().uuid().optional(),
    brand_uuid: z.string().uuid().optional(),
    sort: z.enum(sort_options).optional().default('newest'),
});

export type ProductQueryType = z.infer<typeof ProductQuerySchema>;
