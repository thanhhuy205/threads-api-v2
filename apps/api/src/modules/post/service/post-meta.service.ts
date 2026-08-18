import { redisKey } from "@/constants/resolve-key/redis-key";
import { RedisVersionService } from '@/shared/redis-version';
import { Injectable } from '@nestjs/common';
import { Prisma } from "@prisma/client";
import { normalizeTopic } from "../helper/nomalize.hepler";
import { TopicsPostRepository } from "../repository/topics-post.repository";
import { PostMentionService } from "./post-mention.service";

export type CreatePostMeta = {
  topics?: string[];
  mentionIds: string[];
};

@Injectable()
export class PostMetaService {
  constructor(
    private readonly topicsPostRepository: TopicsPostRepository,
    private readonly postMentionService: PostMentionService,
    private readonly redisVersionService: RedisVersionService,
  ) { }
  async attachPostMeta(
    tx: Prisma.TransactionClient,
    postId: number,
    payload?: CreatePostMeta,
  ): Promise<void> {
    if (!payload) return;
    if (payload.mentionIds.length) {
      await tx.postMention.createMany({
        data: payload.mentionIds.map((userId) => ({
          postId,
          userId,
        })),
      });
    }

    const normalizedTopics = payload.topics?.map(normalizeTopic).filter((v): v is string => !!v);

    if (normalizedTopics?.length) {
      await this.topicsPostRepository.createMany(
        normalizedTopics.map((topicName) => ({
          postId,
          topicName,
        })),
        tx,
      );
    }
  }

  async finalizePostCreation(params: {
    mentionNotification?: Parameters<PostMentionService['dispatchMentionNotifications']>[0];
  }): Promise<void> {
    await Promise.all([
      params.mentionNotification
        ? this.postMentionService.dispatchMentionNotifications(params.mentionNotification)
        : undefined,
      this.redisVersionService.bumpPostListCacheVersion(redisKey.post.listNamespace()),
    ]);
  }
}
