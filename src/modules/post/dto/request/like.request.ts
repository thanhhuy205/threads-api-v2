import { z } from 'zod';

export const likeSchema = z.object({
    isLiked: z.coerce.boolean({ errorMap: () => ({ message: 'isLiked must be a boolean value' }) }),
});

export type LikeDto = z.infer<typeof likeSchema>;