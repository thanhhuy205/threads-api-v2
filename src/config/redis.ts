import z from "zod";

export const redisConfig = z.object({
    REDIS_URL: z.string().url(),
}).required();