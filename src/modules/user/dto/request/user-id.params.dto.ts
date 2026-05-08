import { z } from 'zod';

export const userIdParamsSchema = z.object({
    id: z.string().min(1, 'User ID is required'),
});

export type UserIdParamsDto = z.infer<typeof userIdParamsSchema>;