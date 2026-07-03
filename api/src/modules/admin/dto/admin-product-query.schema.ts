import { z } from 'zod';

export const AdminProductQuerySchema = z.object({
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

export type AdminProductQueryType = z.infer<typeof AdminProductQuerySchema>;
