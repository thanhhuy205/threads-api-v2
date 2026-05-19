import { z } from 'zod';

export const judgeCompleteBodySchema = z.object({
    postId: z.coerce.number().int('Post id must be an integer').positive('Post id must be a positive number'),
    score: z.number(),
    category: z.string().min(1, 'Category is required'),
    hpDelta: z.coerce.number().int('hpDelta must be an integer'),
    expDelta: z.coerce.number().int('expDelta must be an integer'),
    flags: z.array(z.string()).optional().default([]),
});

export type JudgeCompleteBodyDto = z.infer<typeof judgeCompleteBodySchema>;
