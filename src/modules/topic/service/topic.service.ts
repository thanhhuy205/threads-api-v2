import { redisKey } from "@/constants/resolve-key/redis-key";
import { redisService } from "@/providers/redis.provider";
import { buildCursorPagination } from "@/shared/pagination/cursor-pagination";
import { topicRepository } from "../repository/topic.repository";

class TopicService {
  private readonly topicListCacheTtlSeconds = 60 * 5;

  private normalizeTopicName(name: string): string {
    return name.trim().replace(/\s+/g, " ").toLowerCase();
  }

  async searchByName({
    q,
    take, after,
  }: {
    q: string;
    take: number;
    after?: string;
  }) {
    const normalizedName = this.normalizeTopicName(q);
    const topic = await topicRepository.searchByName(normalizedName, after ?? undefined);

    return buildCursorPagination(
      {
        rows: topic,
        take: take,
        getAfter: (item) => (item as { name: string }).name
      }
    )
  }

  async listNames() {
    const cacheKey = redisKey.topic.listNames();
    const cached = await redisService.get(cacheKey);

    if (cached) {
      try {
        return JSON.parse(cached) as string[];
      } catch {
        // Ignore malformed cache and read from DB.
      }
    }

    const topics = await topicRepository.listNames();
    await redisService.set(cacheKey, JSON.stringify(topics), {
      EX: this.topicListCacheTtlSeconds,
    });

    return topics;
  }

  async createOrIncrement(name: string) {
    const normalizedName = this.normalizeTopicName(name);
    const topic = await topicRepository.upsertByName(normalizedName);
    await redisService.del(redisKey.topic.listNames());
    return topic;
  }
}

export const topicService = new TopicService();
