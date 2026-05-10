import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

type CreateTopicsPostInput = {
  postId: number;
  topicName: string;
};

class TopicsPostRepository {
  async create(
    payload: CreateTopicsPostInput,
    tx: Prisma.TransactionClient = prisma,
  ): Promise<void> {
    const topic = await tx.topic.upsert({
      where: {
        name: payload.topicName,
      },
      create: {
        name: payload.topicName,
      },
      update: {
        count: {
          increment: 1,
        },
      },
      select: {
        id: true,
      },
    });

    await tx.topicsPost.create({
      data: {
        postId: payload.postId,
        topicId: topic.id,
        isPublic: true,
      },
    });
  }
}

export const topicsPostRepository = new TopicsPostRepository();
