import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: RedisClientType;

  constructor(configService: ConfigService) {
    this.client = createClient({
      url: configService.get<string>('REDIS_CONFIG.REDIS_URL'),
    });

    this.client.on('error', (err) => {
      console.error(err);
    });
    this.client.on('connect', () => {
      console.log('Redis connecting');
    });

    this.client.on('ready', () => {
      console.log('Redis ready');
    });

    this.client.on('reconnecting', () => {
      console.log('Redis reconnecting');
    });

    this.client.on('end', () => {
      console.log('Redis connection ended');
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
