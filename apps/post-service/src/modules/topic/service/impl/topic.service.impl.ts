import { redisKey } from '@purse/common/constants';
import { RedisService } from '@purse/redis';
import { Inject, Injectable } from '@nestjs/common';
import { TOPIC_REPOSITORY, type TopicRepository } from "../../repository/topic.repository";
import type { TopicService } from '../topic.service';

@Injectable()
export class TopicServiceImpl implements TopicService {
  private readonly topicListCacheTtlSeconds = 60 * 5;

  constructor(
    @Inject(TOPIC_REPOSITORY) private readonly topicRepository: TopicRepository,
    private readonly redisService: RedisService,
  ) { }

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
    await this.redisService.redis.del(redisKey.topic.listNames());
    return topic;
  }
}

