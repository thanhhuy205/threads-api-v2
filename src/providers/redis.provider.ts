import configService from "@/config/config";
import { createClient } from "redis";

const redisClient = createClient({
    url: configService.REDIS_URL,
});

export const redisWorker = {
    host: configService.REDIS_HOST || '127.0.0.1',
    port: Number(configService.REDIS_PORT || 6379),
    password: configService.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
};

export const redisService = redisClient;


