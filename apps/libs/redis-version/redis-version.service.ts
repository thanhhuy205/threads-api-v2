import { Injectable } from '@nestjs/common';
import { redisService } from '@libs/core/providers/redis.provider';

@Injectable()
export class RedisVersionService {
  private getCacheName(namespace: string) {
    return `${namespace}:version`;
  }

  private async getCurrentVersion(namespace: string) {
    const cacheName = this.getCacheName(namespace);
    const version = await redisService.get(cacheName);

    if (!version) {
      await redisService.set(cacheName, '1');
      return '1';
    }

    return version;
  }

  private async getCacheVersionValue<T>(namespace: string): Promise<T | null> {
    const version = await this.getCurrentVersion(namespace);
    const cached = await redisService.get(`${namespace}:data:v${version}`);
    if (!cached) return null;

    try {
      return JSON.parse(cached) as T;
    } catch {
      return null;
    }
  }

  private async setCacheVersionValue<T>(namespace: string, data: T, ttlSeconds: number) {
    const version = await this.getCurrentVersion(namespace);
    await redisService.set(`${namespace}:data:v${version}`, JSON.stringify(data), { EX: ttlSeconds });
  }

  async bumpPostListCacheVersion(namespace: string) {
    await redisService.incr(this.getCacheName(namespace));
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
