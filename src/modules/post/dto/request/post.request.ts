import { NewFeedType } from '@/modules/post/enum';
import { ReportTargetType } from '@prisma/client';
import { z } from 'zod';

export const cursorPaginationQuerySchema = z.object({
    after: z.string().trim().min(1, 'Cursor must not be empty').optional(),
    take: z.coerce.number().int('Take must be an integer').positive('Take must be a positive number').max(100, 'Take must be at most 100').optional(),
});

export type CursorPaginationQueryDto = z.infer<typeof cursorPaginationQuerySchema>;

export const newsFeedQuerySchema = cursorPaginationQuerySchema.extend({
    type: z.nativeEnum(NewFeedType, {
        errorMap: () => ({ message: `Type must be one of: ${Object.values(NewFeedType).join(', ')}` }),
    }).optional(),
});

export type NewsFeedQueryDto = z.infer<typeof newsFeedQuerySchema>;

export const publicIdParamsSchema = z.object({
    publicId: z.string().min(1, 'Post public ID is required'),
});

export type PublicIdParamsDto = z.infer<typeof publicIdParamsSchema>;

export const similarPostsSchema = z.object({
    content: z.string().trim().min(1, 'Content is required'),
    topic: z.array(z.string().trim().min(1, 'Topic must not be empty')),
});

export type SimilarPostsDto = z.infer<typeof similarPostsSchema>;

export const postIdParamsSchema = z.object({
    postId: z.coerce.number().int('Post id must be an integer').positive('Post id must be a positive number'),
});

export type PostIdParamsDto = z.infer<typeof postIdParamsSchema>;

export const usernameParamsSchema = z.object({
    username: z.string().min(1, 'Username is required'),
});

export type UsernameParamsDto = z.infer<typeof usernameParamsSchema>;

export const reportSchema = z.object({
    reason: z.string().trim().min(1, 'Report reason is required').max(1000, 'Report reason must be at most 1000 characters'),
    type: z.enum(['post', 'user', 'circle']).transform((value) => {
        if (value === 'post') return ReportTargetType.POST;
        if (value === 'user') return ReportTargetType.USER;
        return ReportTargetType.CIRCLE;
    }),
});

export type ReportDto = z.infer<typeof reportSchema>;
