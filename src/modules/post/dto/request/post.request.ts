import { NewFeedType } from '@/modules/post/enum';
import { z } from 'zod';

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
});

export type PaginationQueryDto = z.infer<typeof paginationQuerySchema>;

export const newsFeedQuerySchema = paginationQuerySchema.extend({
    type: z.nativeEnum(NewFeedType).optional(),
});

export type NewsFeedQueryDto = z.infer<typeof newsFeedQuerySchema>;

export const publicIdParamsSchema = z.object({
    publicId: z.string().min(1),
});

export type PublicIdParamsDto = z.infer<typeof publicIdParamsSchema>;

export const userIdParamsSchema = z.object({
    userId: z.string().min(1),
});

export type UserIdParamsDto = z.infer<typeof userIdParamsSchema>;

export const reportSchema = z.object({
    reason: z.string().min(1).max(1000),
});

export type ReportDto = z.infer<typeof reportSchema>;
