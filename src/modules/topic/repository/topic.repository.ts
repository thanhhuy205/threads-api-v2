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
}

export const topicRepository = new TopicRepository();
