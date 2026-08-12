import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly client: RedisClientType;

    constructor(configService: ConfigService) {
        this.client = createClient({
            url: configService.get<string>("REDIS_CONFIG.REDIS_URL"),
        });

        this.client.on('error', (err) => {
            console.error(err);
        });
    }

    async onModuleInit() {
        await this.client.connect();
    }

    async onModuleDestroy() {
        if (this.client.isOpen) {
            await this.client.close();
        }
    }

    get redis() {
        return this.client;
    }
}