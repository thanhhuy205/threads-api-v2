import { databaseConfig } from '@/config/database';
import { jwtConfig } from '@/config/jwt';
import { mixedbreadAIConfig } from '@/config/mixedbread-ai';
import { nodemailerConfig } from '@/config/nodemailer';
import { pineconeConfig } from '@/config/pinecone';
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
    RESET_PASSWORD_TOKEN_EXPIRES_IN: z.string().default('15m'),
    ...databaseConfig.shape,
    ...rateLimitConfig.shape,
    ...redisConfig.shape,
    ...jwtConfig.shape,
    ...mixedbreadAIConfig.shape,
    ...pineconeConfig.shape,
    ...nodemailerConfig.shape,

});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error(ENV_MESSAGE.INVALID_ENVIRONMENT_VARIABLES, parsedEnv.error.flatten().fieldErrors);
    throw new Error(ENV_MESSAGE.INVALID_ENVIRONMENT_VARIABLES);
}

const configService = parsedEnv.data;

export default configService;