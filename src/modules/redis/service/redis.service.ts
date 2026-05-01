import configService from "@/config/config";
import { createClient } from "redis";

const redisClient = createClient({
    url: configService.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis error:', err));
redisClient.on('connect', () => console.log('Redis connecting...'));
redisClient.on('ready', () => console.log('Redis ready'));

export const redisService = redisClient;

export const ensureRedisConnection = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    return redisClient;
};