import prisma from "@/config/prisma";
import type { GetTrendingHashtagsInput } from "./interfaces/get-trending-hashtags.input";

class HashtagTrendingRepository {
  async getTrendingHashtags(input: GetTrendingHashtagsInput) {
    return prisma.topic.findMany({
      take: input.limit,
      orderBy: [
        { count: "desc" },
        { updatedAt: "desc" },
      ],
      select: {
        id: true,
        name: true,
        count: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export const hashtagTrendingRepository = new HashtagTrendingRepository();
