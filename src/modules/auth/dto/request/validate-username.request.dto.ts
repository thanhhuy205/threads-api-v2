import { z } from 'zod';
import { AuthErrorMessage } from './auth-error-message';

const usernameRegex = /^[a-zA-Z0-9._-]{3,32}$/;

export const validateUsernameSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, { message: AuthErrorMessage.USERNAME_INVALID })
        .max(32, { message: AuthErrorMessage.USERNAME_INVALID })
        .regex(usernameRegex, { message: AuthErrorMessage.USERNAME_RULE }),
});

export type ValidateUsernameDto = z.infer<typeof validateUsernameSchema>;