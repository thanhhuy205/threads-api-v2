import { redisKey } from "@/constants/resolve-key/redis-key";
import { redisService } from "@/providers/redis.provider";
import { Injectable } from '@nestjs/common';
import { TopicRepository } from "../repository/topic.repository";

@Injectable()
export class TopicService {
  private readonly topicListCacheTtlSeconds = 60 * 5;

  constructor(private readonly topicRepository: TopicRepository) { }

  private normalizeTopicName(name: string): string {
    return name.trim().replace(/\s+/g, " ").toLowerCase();
  }

  async searchByName(query: string) {
    const normalizedName = this.normalizeTopicName(query);
    const results = await this.topicRepository.searchTopic({
      q: normalizedName,
    });

    return results;
  }

  async listNames(topicNames: string[]) {
    const topics = await this.topicRepository.listNames(topicNames);
    return topics;
  }

  async createOrIncrement(name: string) {
    const normalizedName = this.normalizeTopicName(name);
    const topic = await this.topicRepository.upsertByName(normalizedName);
    await redisService.del(redisKey.topic.listNames());
    return topic;
  }
}

