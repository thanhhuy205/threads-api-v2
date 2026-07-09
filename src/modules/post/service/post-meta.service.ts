import { redisKey } from "@/constants/resolve-key/redis-key";
import { redisVersion } from "@/shared/redis-version";
import { Prisma } from "@prisma/client";
import { normalizeTopic } from "../helper/nomalize.hepler";
import { topicsPostRepository } from "../repository/topics-post.repository";
import { postMentionService } from "./post-mention.service";

export type CreatePostMeta = {
  topic?: string;
  mentionIds: string[];
};

class PostMetaService {
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
      await topicsPostRepository.create(
        {
          postId,
          topicName: normalizedTopic,
        },
        tx,
      );
    }
  }

  async finalizePostCreation(params: {
    actionLog?: Promise<unknown>;
    mentionNotification?: Parameters<typeof postMentionService.dispatchMentionNotifications>[0];
  }): Promise<void> {
    await Promise.all([
      params.actionLog,
      params.mentionNotification
        ? postMentionService.dispatchMentionNotifications(params.mentionNotification)
        : undefined,
      redisVersion.bumpPostListCacheVersion(redisKey.post.listNamespace()),
    ]);
  }
}

export const postMetaService = new PostMetaService();
