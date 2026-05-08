import { z } from 'zod';

export const usernameParamsSchema = z.object({
    username: z.string().min(1),
});

export type UsernameParamsDto = z.infer<typeof usernameParamsSchema>;
