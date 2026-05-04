import configService from "@/config/config";
import IORedis from 'ioredis';
import { createClient } from "redis";

const redisClient = createClient({
    url: configService.REDIS_URL,
});

export const redisQueue = new IORedis({
    host: configService.REDIS_HOST || '127.0.0.1',
    port: Number(configService.REDIS_PORT || 6379),
    password: configService.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
});



export const redisWorker = new IORedis({
    host: configService.REDIS_HOST || '127.0.0.1',
    port: Number(configService.REDIS_PORT || 6379),
    password: configService.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
});

redisClient.on('error', (err) => console.log('Redis error:', err));
redisClient.on('connect', () => console.log('Redis connecting...'));
redisClient.on('ready', () => console.log('Redis ready'));

export const redisService = redisClient;


