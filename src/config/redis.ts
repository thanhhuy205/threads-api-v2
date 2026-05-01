import z from "zod";

export const redisConfig = z.object({
    url: z.string().url(),
}).required();