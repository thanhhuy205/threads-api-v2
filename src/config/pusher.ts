import { z } from 'zod';

export const pusherConfig = z.object({
    PUSHER_APP_ID: z.string().default('app-id'),
    PUSHER_KEY: z.string().default('app-key'),
    PUSHER_SECRET: z.string().default('app-secret'),
    PUSHER_HOST: z.string().default('127.0.0.1'),
    PUSHER_PORT: z.coerce.number().int().default(6001),
    PUSHER_USE_TLS: z.coerce.boolean().default(false),
    PUSHER_CLUSTER: z.string().default('mt1'),
});
