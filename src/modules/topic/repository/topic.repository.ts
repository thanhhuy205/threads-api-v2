import prisma from "@/config/prisma";

export type TopicRecord = {
  name: string;
  count: number;
};

class TopicRepository {
  async findByName(name: string): Promise<TopicRecord | null> {
    const topic = await prisma.topic.findUnique({
      where: {
        name,
      },
      select: {
        name: true,
        count: true,
      },
    });

    if (!topic) {
      return null;
    }

    return {
      name: topic.name,
      count: topic.count,
    };
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
