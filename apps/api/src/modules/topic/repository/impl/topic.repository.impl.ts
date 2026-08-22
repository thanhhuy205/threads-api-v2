import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import type { TopicRepository } from '../topic.repository';

export type TopicRecord = {
  name: string;
  count: number;
};

@Injectable()
export class TopicRepositoryImpl implements TopicRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll({ after, take, where }: { after?: string; take?: number; where?: { q: string; } | undefined; }): Promise<TopicRecord[]> {
    return this.prisma.topic.findMany({
      where: {
        name: {
          contains: where?.q,
        },
      },
      orderBy: {
        count: "desc",
      },
      cursor: after
        ? {
          name: after,
        }
        : undefined,
      skip: after ? 1 : 0,
      take,
      select: {
        name: true,
        count: true,
      },
    });
  }
  async searchByName(q: string, after?: string) {
    return this.findAll({
      where: { q },
      after,
    });
  }

  async listNames(topicNames: string[]): Promise<{ name: string; }[]> {
    return await this.prisma.topic.findMany({
      where: {
        name: {
          in: topicNames
        }
      },
      select: {
        name: true,
      },
      orderBy: {
        count: "desc",
      },
    });
  }

  async upsertByName(name: string): Promise<TopicRecord> {
    const topic = await this.prisma.topic.upsert({
      where: {
        name,
      },
      create: {
        name,
      },
      update: {
        count: {
          increment: 1,
        },
      },
      select: {
        name: true,
        count: true,
      },
    });

    return {
      name: topic.name,
      count: topic.count,
    };
  }
  searchTopic({ q }: { q: string; }): Promise<TopicRecord[]> {
    return this.prisma.$queryRaw<TopicRecord[]>`
      SELECT name, count
      FROM topics
      WHERE MATCH(name) AGAINST (${q} IN BOOLEAN MODE)
      ORDER BY count DESC, MATCH(name) AGAINST (${q} IN BOOLEAN MODE)  DESC
      LIMIT 20
    `;
  }
}

