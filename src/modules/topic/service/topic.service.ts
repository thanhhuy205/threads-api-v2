import { redisKey } from "@/constants/resolve-key/redis-key";
import { searchService } from "@/modules/search/service/search.service";
import { redisService } from "@/providers/redis.provider";
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
    const results = await searchService.searchTopic({
      q: normalizedName,
      take,
      after,
    });

    return results;
  }

  async listNames(topicNames: string[]) {
    const topics = await topicRepository.listNames(topicNames);
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
