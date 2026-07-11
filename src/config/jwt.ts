import z from "zod";

export const jwtConfig = z.object({
    JWT_SECRET: z.string().min(1),
    ACCESS_EXPIRES: z.coerce.string().min(1).default("15m"),
    REFRESH_TOKEN_EXPIRES_IN: z.coerce.string().min(1).default("7d"),
    RESET_PASSWORD_TOKEN_EXPIRES_IN_TEXT: z.string().min(1).default("15m"),
    RESEND_VERIFY_EMAIL_TOKEN_EXPIRES_IN_TEXT: z.string().min(1).default("15m"),
    RESET_PASSWORD_TOKEN_EXPIRES_IN: z.coerce.string().min(1).default("15"),
    RESEND_VERIFY_EMAIL_TOKEN_EXPIRES_IN: z.coerce.string().min(1).default("15")
});