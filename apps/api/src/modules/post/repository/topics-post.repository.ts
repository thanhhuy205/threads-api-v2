import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from "@prisma/client";

type CreateTopicsPostInput = {
  postId: number;
  topicName: string;
};

@Injectable()
export class TopicsPostRepository {
  constructor(private readonly prisma: PrismaService) { }


  async upsert(payload: CreateTopicsPostInput, tx: Prisma.TransactionClient = this.prisma): Promise<void> {
    await tx.topic.upsert({
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
  }

  async findByPostId(postId: number): Promise<{ topicName: string | null }[]> {
    const result = await this.prisma.topicsPost.findMany({
      where: {
        postId,
      },
      select: {
        topic: {
          select: {
            name: true,
          },
        },
      },
    });
    return result.map((item) => ({ topicName: item.topic?.name || null }));

  }

  async create(
    payload: CreateTopicsPostInput,
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    return tx.topicsPost.create({
      data: {
        post: {
          connect: {
            id: payload.postId,
          },
        },

        topic: {
          connectOrCreate: {
            where: {
              name: payload.topicName,
            },
            create: {
              name: payload.topicName,
            },
          },
        },
      },
    });
  }

  async createMany(
    payloads: CreateTopicsPostInput[],
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<void> {
    const result = await this.prisma.topic.createMany({
      data: payloads.map((payload) => ({
        name: payload.topicName,
      })),
      skipDuplicates: true,
    });
  }
}
