import { z } from 'zod';

export const ScanQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 20)),
});

export type ScanQueryType = z.infer<typeof ScanQuerySchema>;

export const RecentScansQuerySchema = z.object({
    limit: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 5)),
});

export type RecentScansQueryType = z.infer<typeof RecentScansQuerySchema>;
