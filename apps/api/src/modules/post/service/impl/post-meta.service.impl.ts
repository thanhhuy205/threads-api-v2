import { RedisVersionService } from '@/shared/redis-version';
import { redisKey } from "@libs/core/constants/redis-key";
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from "../../../../../generated/prisma";
import { normalizeTopic } from "../../helper/nomalize.hepler";
import { TOPICS_POST_REPOSITORY, type TopicsPostRepository } from "../../repository/topics-post.repository";
import { POST_MENTION_SERVICE, type PostMentionService } from "../post-mention.service";
import type { CreatePostMeta, PostMetaService } from '../post-meta.service';

@Injectable()
export class PostMetaServiceImpl implements PostMetaService {
  constructor(
    @Inject(TOPICS_POST_REPOSITORY) private readonly topicsPostRepository: TopicsPostRepository,
    @Inject(POST_MENTION_SERVICE) private readonly postMentionService: PostMentionService,
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
      await this.topicsPostRepository.createManyAndConnectOrIncreaseCount(
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
