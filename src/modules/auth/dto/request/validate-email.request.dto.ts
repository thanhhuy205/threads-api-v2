import { z } from 'zod';
import { AuthErrorMessage } from './auth-error-message';

export const validateEmailSchema = z.object({
    email: z.string().trim().email({ message: AuthErrorMessage.EMAIL_INVALID }).max(255),
});

export type ValidateEmailDto = z.infer<typeof validateEmailSchema>;