import { redisService } from "@/providers/redis.provider";

class RedisVersion {
    private getCacheName(namespace: string) {
        return `${namespace}:version`;
    }

    private async getCurrentVersion(namespace: string) {
        const versionKey = await redisService.get(this.getCacheName(namespace));

        const version = await redisService.get(versionKey!);
        if (!version) {
            await redisService.set(versionKey!, "1");
        }

        return version;
    }

    private async getCacheVersionValue<T>(namespace: string): Promise<T | null> {
        const version = await this.getCurrentVersion(namespace);
        const dataKey = `${namespace}:data:v${version}`;

        const cached = await redisService.get(dataKey);
        if (!cached) return null;

        try {
            return JSON.parse(cached) as T;
        } catch {
            return null;
        }
    }

    private async setCacheVersionValue<T>(namespace: string, data: T, ttlSeconds: number) {
        const version = await this.getCurrentVersion(namespace);
        const dataKey = `${namespace}:data:v${version}`;

        await redisService.set(dataKey, JSON.stringify(data), {
            EX: ttlSeconds
        });
    }

    public async bumpPostListCacheVersion(namespace: string) {
        const cacheName = await redisService.get(this.getCacheName(namespace));
        await redisService.incr(cacheName!);
    }


    public async wrapperCacheVersion<T>(namespace: string, ttlSeconds: number, factory: () => Promise<T>): Promise<T> {
        let cached: T | null = null;
        try {
            cached = await this.getCacheVersionValue<T>(namespace);
        } catch {
            cached = null;
        }
        if (cached) return cached;

        const data = await factory();

        try {
            await this.setCacheVersionValue(namespace, data, ttlSeconds);
        } catch {
        }

        return data;
    }

}
export const redisVersion = new RedisVersion(); 