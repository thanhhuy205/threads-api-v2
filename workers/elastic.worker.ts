import prisma from "@/config/prisma";
import { ELASTIC_JOB_NAME, QUEUE_NAME } from "@/constants/queue";
import type { ElasticPostRequestDto } from "@/modules/job/elastic-search/dto/elastic-post.request.dto";
import type { ElasticUserRequestDto } from "@/modules/job/elastic-search/dto/elastic-user.request.dto";
import { elasticSearchClient } from "@/providers/elastic-search.provider";
import { createWorker } from "@/providers/bullmq.provider";

const SEARCH_INDEX = "search";

class ElasticWorker {
  private readonly worker = createWorker(QUEUE_NAME.ELASTIC_QUEUE, async (job) => {
    switch (job.name) {
      case ELASTIC_JOB_NAME.ADD_POST:
        return this.addPost(job.data as ElasticPostRequestDto);
      case ELASTIC_JOB_NAME.ADD_USER:
        return this.addUser(job.data as ElasticUserRequestDto);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  });

  private normalizeTopic(topic?: string): string | undefined {
    if (!topic) return undefined;
    const normalized = topic.trim().replace(/\s+/g, " ").toLowerCase();
    return normalized || undefined;
  }

  async addPost(data: ElasticPostRequestDto) {
    const createdAt = data.createdAt || new Date().toISOString();

    await elasticSearchClient.index({
      index: SEARCH_INDEX,
      id: `post_${data.postId}`,
      body: {
        type: "post",
        postId: data.postId,
        publicId: data.publicId,
        userId: data.userId,
        content: data.content,
        authorUsername: data.authorUsername,
        authorName: data.authorName ?? "",
        createdAt,
      },
    });

    const normalizedTopic = this.normalizeTopic(data.topic);
    if (!normalizedTopic) {
      return;
    }

    const existingTopic = await prisma.topic.findUnique({
      where: { name: normalizedTopic },
      select: {
        name: true,
        count: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const now = new Date().toISOString();
    await elasticSearchClient.update({
      index: SEARCH_INDEX,
      id: `topic_${normalizedTopic}`,
      body: {
        doc: {
          type: "topic",
          topicName: normalizedTopic,
          postCount: existingTopic?.count ?? 1,
          createdAt: existingTopic?.createdAt?.toISOString() ?? now,
          updatedAt: existingTopic?.updatedAt?.toISOString() ?? now,
        },
        doc_as_upsert: true,
      },
    });
  }

  async addUser(data: ElasticUserRequestDto) {
    await elasticSearchClient.index({
      index: SEARCH_INDEX,
      id: `user_${data.userId}`,
      body: {
        type: "user",
        username: data.username,
        name: data.name ?? "",
        bio: data.bio ?? "",
        avatar: data.avatar ?? null,
        isVerified: data.isVerified ?? false,
        createdAt: data.createdAt || new Date().toISOString(),
      },
    });
  }
}

export const elasticWorker = new ElasticWorker();
