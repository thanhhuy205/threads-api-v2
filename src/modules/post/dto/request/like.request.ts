import { z } from 'zod';

export const likeSchema = z.object({
    isLiked: z.boolean({
        required_error: 'isLiked is required',
        invalid_type_error: 'isLiked must be a boolean value',
    }),
});

export type LikeDto = z.infer<typeof likeSchema>;