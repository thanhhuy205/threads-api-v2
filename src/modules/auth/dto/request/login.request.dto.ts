import { z } from 'zod';

const usernameRegex = /^[a-zA-Z0-9._-]{3,32}$/;

export const loginSchema = z.object({
    login: z
        .string()
        .trim()
        .min(3, 'Login must be at least 3 characters')
        .max(255, 'Login must be at most 255 characters')
        .refine((value) => {
            if (value.includes('@')) {
                return z.string().email().safeParse(value).success;
            }

            return usernameRegex.test(value);
        }, 'Login must be a valid email or username'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password must be at most 128 characters'),
});

export type LoginDto = z.infer<typeof loginSchema>;