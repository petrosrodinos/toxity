import { z } from 'zod';

const sort_options = [
    'highest_rated',
    'lowest_rated',
    'newest',
    'most_popular',
] as const;

export const SearchQuerySchema = z.object({
    q: z.string().min(1),
    category_uuid: z.string().uuid().optional(),
    subcategory_uuid: z.string().uuid().optional(),
    sort: z.enum(sort_options).optional().default('newest'),
    page: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 20)),
});

export type SearchQueryType = z.infer<typeof SearchQuerySchema>;
