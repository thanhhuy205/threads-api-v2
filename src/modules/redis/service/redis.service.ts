import { redisConfig } from "@/config";
import { createClient } from "redis";

const redisClient = createClient({
    url: redisConfig.url
});

redisClient.on('error', (err) => console.log('Redis error:', err));
redisClient.on('connect', () => console.log('Redis connecting...'));
redisClient.on('ready', () => console.log('Redis ready'));

export const redisService = redisClient;