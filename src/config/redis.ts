import z from "zod";

export const redisConfig = z.object({
    REDIS_URL: z.string().url(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number().int().positive(),
    REDIS_PASSWORD: z.string().optional(),
}).required();