import { z } from 'zod';

const usernameRegex = /^[a-zA-Z0-9._-]{3,32}$/;

export const loginSchema = z.object({
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
    password: z.string().min(6).max(128),
});

export type LoginDto = z.infer<typeof loginSchema>;