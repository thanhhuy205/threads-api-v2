import z from "zod";

export const databaseConfig = z.object({
    DATABASE_URL: z.string().min(1),
    DB_POOL_SIZE: z.coerce.number().int().positive().default(10),
    DB_NAME: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_HOST: z.string().min(1),
    DB_PORT: z.coerce.number().int().positive().default(5432),
});