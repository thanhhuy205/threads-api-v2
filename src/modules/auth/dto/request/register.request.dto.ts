import { z } from 'zod';
import { AuthErrorMessage } from './auth-error-message';

const usernameRegex = /^[a-zA-Z0-9._-]{3,32}$/;

const usernameSchema = z
    .string()
    .trim()
    .min(3)
    .max(32)
    .refine((value) => usernameRegex.test(value), AuthErrorMessage.USERNAME_RULE);

const emailSchema = z.string().trim().email({ message: AuthErrorMessage.EMAIL_INVALID }).max(255);

const passwordSchema = z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password must be at most 128 characters');

export const registerSchema = z
    .object({
        username: usernameSchema,
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: AuthErrorMessage.PASSWORD_CONFIRM_NOT_MATCH,
        path: ['confirmPassword'],
    });

export type RegisterDto = z.infer<typeof registerSchema>;