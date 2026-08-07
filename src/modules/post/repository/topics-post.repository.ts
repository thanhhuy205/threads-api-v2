import legacyPrisma from "@/config/prisma";
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/database/prisma.service';
import { Prisma } from "@prisma/client";

type CreateTopicsPostInput = {
  postId: number;
  topicName: string;
};

@Injectable()
export class TopicsPostRepository {
  constructor(private readonly prisma: PrismaService = legacyPrisma as unknown as PrismaService) {}

  async create(
    payload: CreateTopicsPostInput,
    tx: Prisma.TransactionClient = this.prisma,
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
