import { z } from 'zod';

export const AuthErrorMessage = {
    USERNAME_INVALID: 'auth.error.usernameInvalid',
    USERNAME_RULE: 'auth.error.usernameRule',
    USERNAME_EXISTS: 'auth.error.usernameExists',
    EMAIL_INVALID: 'auth.error.emailInvalid',
    EMAIL_EXISTS: 'auth.error.emailExists',
    PASSWORD_INVALID: 'auth.error.passwordInvalid',
    PASSWORD_MIN: 'auth.error.passwordMin',
    PASSWORD_CONFIRM_NOT_MATCH: 'auth.error.passwordConfirmNotMatch',
} as const;

const usernameRegex = /^[a-zA-Z0-9._-]{3,32}$/;

const usernameSchema = z
    .string()
    .trim()
    .min(3)
    .max(32)
    .refine((value) => usernameRegex.test(value), 'Username must be 3-32 characters and contain only letters, numbers, dots, underscores, and hyphens');

const emailSchema = z.string().trim().email().max(255);

const passwordSchema = z.string().min(6).max(128);

const loginSchema = z.object({
    login: z
        .string()
        .trim()
        .min(3)
        .max(255)
        .refine((value) => {
            if (value.includes('@')) {
                return z.string().email().safeParse(value).success;
            }

            return usernameRegex.test(value);
        }, 'Login must be a valid email or username'),
    password: passwordSchema,
});

const registerSchema = z
    .object({
        username: usernameSchema,
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Confirm password must match password',
        path: ['confirmPassword'],
    });

const logoutSchema = z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
});

const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1),
});

const forgotPasswordSchema = z.object({
    email: emailSchema,
});

const resetPasswordSchema = z
    .object({
        token: z.string().min(1),
        email: emailSchema,
        password: z.string().min(8, { message: AuthErrorMessage.PASSWORD_MIN }).max(128),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: AuthErrorMessage.PASSWORD_CONFIRM_NOT_MATCH,
        path: ['confirmPassword'],
    });

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type LogoutDto = z.infer<typeof logoutSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

export { forgotPasswordSchema, loginSchema, logoutSchema, refreshTokenSchema, registerSchema, resetPasswordSchema };

