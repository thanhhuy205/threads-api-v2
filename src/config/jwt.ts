import z from "zod";

export const jwtConfig = z.object({
    JWT_SECRET: z.string().min(1),
    ACCESS_EXPIRES: z.coerce.string().min(1).default("15m"),
    REFRESH_TOKEN_EXPIRES_IN: z.coerce.string().min(1).default("7d"),
});