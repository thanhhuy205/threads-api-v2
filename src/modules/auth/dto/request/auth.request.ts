import { z } from 'zod';

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

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type LogoutDto = z.infer<typeof logoutSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

export { loginSchema, logoutSchema, refreshTokenSchema, registerSchema };

