import { z } from 'zod';
import { AuthErrorMessage } from './auth-error-message';

export const resetPasswordSchema = z
    .object({
        token: z.string().min(1, 'Reset token is required'),
        email: z.string().trim().email({ message: AuthErrorMessage.EMAIL_INVALID }).max(255),
        password: z.string().min(8, { message: AuthErrorMessage.PASSWORD_MIN }).max(128),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: AuthErrorMessage.PASSWORD_CONFIRM_NOT_MATCH,
        path: ['confirmPassword'],
    });

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;