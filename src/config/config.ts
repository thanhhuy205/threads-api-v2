import { cloudflareConfig } from '@/config/cloudflare';
import { databaseConfig } from '@/config/database';
import { groQConfig } from '@/config/groq';
import { jwtConfig } from '@/config/jwt';
import { leonardoConfig } from '@/config/leonardo';
import { mongodbConfig } from '@/config/mongodb';
import { nodemailerConfig } from '@/config/nodemailer';
import { notionConfig } from '@/config/notion';
import { openRouterConfig } from '@/config/openrouter';
import { pusherConfig } from '@/config/pusher';
import { rateLimitConfig } from '@/config/ratelimit';
import { redisConfig } from '@/config/redis';
import { ENV_MESSAGE } from '@/constants/message';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    CORS_ORIGIN: z.string().default('*'),
    FRONTEND_URL: z.string().default('http://localhost:5173'),
    ...databaseConfig.shape,
    ...rateLimitConfig.shape,
    ...redisConfig.shape,
    ...jwtConfig.shape,
    ...nodemailerConfig.shape,
    ...cloudflareConfig.shape,
    ...pusherConfig.shape,
    ...openRouterConfig.shape,
    ...leonardoConfig.shape,
    ...notionConfig.shape,
    ...groQConfig.shape,
    ...mongodbConfig.shape,
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error(ENV_MESSAGE.INVALID_ENVIRONMENT_VARIABLES, parsedEnv.error.flatten().fieldErrors);
    throw new Error(ENV_MESSAGE.INVALID_ENVIRONMENT_VARIABLES);
}

const configService = parsedEnv.data;

export default configService;
