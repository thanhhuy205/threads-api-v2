import { z } from 'zod';

export const likeSchema = z.object({
    isLiked: z.boolean(),
});

export type LikeDto = z.infer<typeof likeSchema>;