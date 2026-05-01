import { databaseConfig } from '@/config/database';
import { rateLimitConfig } from '@/config/ratelimit';
import { redisConfig } from '@/config/redis';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    CORS_ORIGIN: z.string().default('*'),
    ...databaseConfig.shape,
    ...rateLimitConfig.shape,
    ...redisConfig.shape,

});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
}

const configService = parsedEnv.data;

export default configService;