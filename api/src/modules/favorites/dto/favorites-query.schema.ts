import { z } from 'zod';

const entity_types = ['PRODUCT', 'INGREDIENT', 'BRAND'] as const;

export const FavoritesQuerySchema = z.object({
    type: z.enum(entity_types).optional(),
    page: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 20)),
});

export type FavoritesQueryType = z.infer<typeof FavoritesQuerySchema>;

export const FavoriteCheckQuerySchema = z.object({
    entity_type: z.enum(entity_types),
    entity_uuid: z.string().min(1),
});

export type FavoriteCheckQueryType = z.infer<typeof FavoriteCheckQuerySchema>;
