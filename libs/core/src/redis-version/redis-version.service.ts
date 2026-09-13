import { RedisService } from '../redis/redis.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisVersionService {
  constructor(private readonly redisService: RedisService) { }

  private getCacheName(namespace: string) {
    return `${namespace}:version`;
  }

  private async getCurrentVersion(namespace: string) {
    const cacheName = this.getCacheName(namespace);
    const version = await this.redisService.redis.get(cacheName);

    if (!version) {
      await this.redisService.redis.set(cacheName, '1');
      return '1';
    }

    return version;
  }

  private async getCacheVersionValue<T>(namespace: string): Promise<T | null> {
    const version = await this.getCurrentVersion(namespace);
    const cached = await this.redisService.redis.get(`${namespace}:data:v${version}`);
    if (!cached) return null;

    try {
      return JSON.parse(cached) as T;
    } catch {
      return null;
    }
  }

  private async setCacheVersionValue<T>(namespace: string, data: T, ttlSeconds: number) {
    const version = await this.getCurrentVersion(namespace);
    await this.redisService.redis.set(`${namespace}:data:v${version}`, JSON.stringify(data), { EX: ttlSeconds });
  }

  async bumpPostListCacheVersion(namespace: string) {
    await this.redisService.redis.incr(this.getCacheName(namespace));
  }

  async wrapperCacheVersion<T>(namespace: string, ttlSeconds: number, factory: () => Promise<T>): Promise<T> {
    try {
      const cached = await this.getCacheVersionValue<T>(namespace);
      if (cached !== null) return cached;
    } catch {
      // Redis cache failures must not prevent the request from completing.
    }

    const data = await factory();
    try {
      await this.setCacheVersionValue(namespace, data, ttlSeconds);
    } catch {
      // Redis cache failures must not prevent the request from completing.
    }
    return data;
  }
}
