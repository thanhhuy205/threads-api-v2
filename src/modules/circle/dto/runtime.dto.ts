import { z } from 'zod';
import { VisibilityPost } from '@prisma/client';
import { CreatePostDto, createPostSchema } from '@/modules/post/dto/post.dto';

export const circlePublicIdParamsSchema = z.object({
    publicId: z.string().min(1, 'Circle public ID is required'),
});

export type CirclePublicIdParamsDto = z.infer<typeof circlePublicIdParamsSchema>;

export const cursorLimitQuerySchema = z.object({
    limit: z.coerce.number().int('Limit must be an integer').positive('Limit must be a positive number').max(100, 'Limit must be at most 100').optional(),
    cursor: z.string().trim().min(1, 'Cursor must not be empty').optional(),
});

export const expLogQuerySchema = cursorLimitQuerySchema;
export type ExpLogQueryDto = z.infer<typeof expLogQuerySchema>;

export const circlePostsQuerySchema = cursorLimitQuerySchema.extend({
    sort: z.enum(['latest', 'quality']).optional(),
});

export type CirclePostsQueryDto = z.infer<typeof circlePostsQuerySchema>;

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
