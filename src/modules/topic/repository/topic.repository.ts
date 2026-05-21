import prisma from "@/config/prisma";

export type TopicRecord = {
  name: string;
  count: number;
};

class TopicRepository implements ICursorPagination<{ q: string }, TopicRecord> {
  findAll({ after, take, where }: { after?: string; take?: number; where?: { q: string; } | undefined; }): Promise<TopicRecord[]> {
    return prisma.topic.findMany({
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

  async listNames(): Promise<string[]> {
    const topics = await prisma.topic.findMany({
      select: {
        name: true,
      },
      orderBy: {
        count: "desc",
      },
    });

    return topics.map((topic) => topic.name);
  }

  async upsertByName(name: string): Promise<TopicRecord> {
    const topic = await prisma.topic.upsert({
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
}

export const topicRepository = new TopicRepository();
