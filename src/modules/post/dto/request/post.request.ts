import { NewFeedType } from '@/modules/post/enum';
import { z } from 'zod';

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
});

export type PaginationQueryDto = z.infer<typeof paginationQuerySchema>;

export const newsFeedQuerySchema = paginationQuerySchema.extend({
    feedType: z.nativeEnum(NewFeedType).optional(),
});

export type NewsFeedQueryDto = z.infer<typeof newsFeedQuerySchema>;

export const postIdParamsSchema = z.object({
    postId: z.coerce.number().int().positive(),
});

export type PostIdParamsDto = z.infer<typeof postIdParamsSchema>;

export const userIdParamsSchema = z.object({
    userId: z.string().min(1),
});

export type UserIdParamsDto = z.infer<typeof userIdParamsSchema>;
