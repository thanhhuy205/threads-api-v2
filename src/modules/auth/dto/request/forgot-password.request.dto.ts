import { z } from 'zod';
import { AuthErrorMessage } from './auth-error-message';

export const forgotPasswordSchema = z.object({
    email: z.string().trim().email({ message: AuthErrorMessage.EMAIL_INVALID }).max(255),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;