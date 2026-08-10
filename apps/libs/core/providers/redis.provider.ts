import configService from "@/config/config";
import { createClient } from "redis";

const redisClient = createClient({
    url: configService.REDIS_CONFIG.REDIS_URL,
});

export const redisWorker = {
    host: configService.REDIS_CONFIG.REDIS_HOST,
    port: configService.REDIS_CONFIG.REDIS_PORT,
    password: configService.REDIS_CONFIG.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
};

export const redisService = redisClient;


