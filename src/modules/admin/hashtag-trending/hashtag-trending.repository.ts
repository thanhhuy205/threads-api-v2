import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/pagination";
import { Prisma } from "@prisma/client";
import type { GetTrendingHashtagsInput } from "./interfaces/get-trending-hashtags.input";

const trendingHashtagSelect = {
  id: true,
  name: true,
  count: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TopicSelect;

type TrendingHashtagRow = Prisma.TopicGetPayload<{
  select: typeof trendingHashtagSelect;
}>;

class HashtagTrendingRepository
  implements IPagination<Prisma.TopicWhereInput, TrendingHashtagRow>
{
  findAll({
    page,
    limit,
    where,
    props,
  }: {
    page: number;
    limit: number;
    where?: Prisma.TopicWhereInput;
    props?: {
      orderBy?: Prisma.TopicOrderByWithRelationInput[];
    };
  }): Promise<TrendingHashtagRow[]> {
    const { offset, currentLimit } = buildPagination({ page, limit });

    return prisma.topic.findMany({
      where,
      skip: offset,
      take: currentLimit,
      orderBy: props?.orderBy,
      select: trendingHashtagSelect,
    });
  }

  count({
    where,
  }: {
    where?: Prisma.TopicWhereInput;
    props?: any;
  }): Promise<number> {
    return prisma.topic.count({ where });
  }

  async getTrendingHashtags(input: GetTrendingHashtagsInput) {
    return this.findAll({
      page: input.page,
      limit: input.limit,
      props: {
        orderBy: [
          { count: "desc" },
          { updatedAt: "desc" },
          { id: "asc" },
        ],
      },
    });
  }

  async countTrendingHashtags({ where }: { where?: Prisma.TopicWhereInput } = {}) {
    return this.count({
      where,
      props: {},
    });
  }
}

export const hashtagTrendingRepository = new HashtagTrendingRepository();
