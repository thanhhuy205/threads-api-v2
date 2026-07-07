import { Prisma } from "@prisma/client";
import { normalizeTopic } from "../helper/nomalize.hepler";
import { topicsPostRepository } from "../repository/topics-post.repository";

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
}

export const postMetaService = new PostMetaService();
