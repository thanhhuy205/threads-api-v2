import { redisKey } from "@/constants/resolve-key/redis-key";
import { redisVersion } from "@/shared/redis-version";
import { Prisma } from "@prisma/client";
import { normalizeTopic } from "../helper/nomalize.hepler";
import { Injectable } from '@nestjs/common';
import { TopicsPostRepository } from "../repository/topics-post.repository";
import { PostMentionService } from "./post-mention.service";

export type CreatePostMeta = {
  topic?: string;
  mentionIds: string[];
};

@Injectable()
export class PostMetaService {
  constructor(
    private readonly topicsPostRepository: TopicsPostRepository,
    private readonly postMentionService: PostMentionService,
  ) {}
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

    const normalizedTopic = normalizeTopic(payload.topic);

    if (normalizedTopic) {
      await this.topicsPostRepository.create(
        {
          postId,
          topicName: normalizedTopic,
        },
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
      redisVersion.bumpPostListCacheVersion(redisKey.post.listNamespace()),
    ]);
  }
}
