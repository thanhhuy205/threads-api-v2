import { NewFeedType } from '@/modules/post/enum';
import { z } from 'zod';

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int('Page must be an integer').positive('Page must be a positive number').optional(),
    limit: z.coerce.number().int('Limit must be an integer').positive('Limit must be a positive number').optional(),
});

export type PaginationQueryDto = z.infer<typeof paginationQuerySchema>;

export const newsFeedQuerySchema = paginationQuerySchema.extend({
    type: z.nativeEnum(NewFeedType, {
        errorMap: () => ({ message: `Type must be one of: ${Object.values(NewFeedType).join(', ')}` }),
    }).optional(),
});

export type NewsFeedQueryDto = z.infer<typeof newsFeedQuerySchema>;

export const publicIdParamsSchema = z.object({
    publicId: z.string().min(1, 'Post public ID is required'),
});

export type PublicIdParamsDto = z.infer<typeof publicIdParamsSchema>;

export const userIdParamsSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
});

export type UserIdParamsDto = z.infer<typeof userIdParamsSchema>;

export const reportSchema = z.object({
    reason: z.string().min(1, 'Report reason is required').max(1000, 'Report reason must be at most 1000 characters'),
});

export type ReportDto = z.infer<typeof reportSchema>;
