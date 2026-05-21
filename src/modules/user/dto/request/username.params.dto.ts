import { z } from 'zod';

export const usernameParamsSchema = z.object({
    username: z.string().min(1, 'Username is required'),
});


export const usernameQuerySchema = z.object({
    q: z.string().min(1, 'Query is required'),
    after: z.string().trim().min(1, 'Cursor must not be empty').optional(),
    take: z.coerce.number().int('Take must be an integer').positive('Take must be a positive number').max(100, 'Take must be at most 100').optional(),
});

export const userNameMentionQuerySchema = z.object({
    q: z.string().min(1, 'Username include is required'),
    after: z.string().min(1, 'Userid after is required').optional(),
    take: z.coerce.number().int('Take must be an integer').positive('Take must be a positive number').max(100, 'Take must be at most 100').optional(),
});

export type UserNameMentionQueryDto = z.infer<typeof userNameMentionQuerySchema>;
export type UsernameParamsDto = z.infer<typeof usernameParamsSchema>;
