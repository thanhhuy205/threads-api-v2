import { CreatePostDto, createPostSchema } from '@/modules/post/dto/post.dto';
import { VisibilityPost } from '@prisma/client';
import { z } from 'zod';

export const circlePublicIdParamsSchema = z.object({
    publicId: z.string().min(1, 'Circle public ID is required'),
});

export type CirclePublicIdParamsDto = z.infer<typeof circlePublicIdParamsSchema>;

export const circleReplyParamsSchema = z.object({
    publicId: z.string().min(1, 'Circle public ID is required'),
    postPublicId: z.string().min(1, 'Post public ID is required'),
});

export type CircleReplyParamsDto = z.infer<typeof circleReplyParamsSchema>;

export const cursorLimitQuerySchema = z.object({
    take: z.coerce.number().int('take must be an integer').positive('take must be a positive number').max(100, 'take must be at most 100').optional(),
    after: z.string().trim().min(1, 'Cursor must not be empty').optional(),
});

export const expLogQuerySchema = cursorLimitQuerySchema;
export type ExpLogQueryDto = z.infer<typeof expLogQuerySchema>;

export const circlePostsQuerySchema = cursorLimitQuerySchema.extend({
    sort: z.enum(['latest', 'quality']).optional(),
    take: z.coerce.number().int('Take must be an integer').positive('Take must be a positive number').max(100, 'Take must be at most 100').optional(),
});

export type CirclePostsQueryDto = z.infer<typeof circlePostsQuerySchema>;
export type CircleRepliesQueryDto = z.infer<typeof cursorLimitQuerySchema>;

export const createCirclePostRuntimeSchema = z.preprocess(
    (value) => {
        if (!value || typeof value !== 'object') {
            return value;
        }

        const payload = value as Record<string, unknown>;
        if (payload.visibility !== undefined) {
            return payload;
        }

        return {
            ...payload,
            visibility: VisibilityPost.CIRCLE,
        };
    },
    createPostSchema,
);

export type CirclePostBodyDto = CreatePostDto;

export const cprBodySchema = z.object({
    targetComments: z.coerce.number().int('Target comments must be an integer').positive('Target comments must be a positive number'),
});

export type CprBodyDto = z.infer<typeof cprBodySchema>;

export const sacrificeBodySchema = z.object({
    karmaAmount: z.coerce.number().int('Karma amount must be an integer').positive('Karma amount must be a positive number'),
});

export type SacrificeBodyDto = z.infer<typeof sacrificeBodySchema>;
