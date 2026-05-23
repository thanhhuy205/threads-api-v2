import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/pagination";
import { Prisma } from "@prisma/client";
import type { CreateDailyQuestInput } from "./interfaces/create-daily-quest.input";
import type { GetAdminDailyQuestsInput } from "./interfaces/get-admin-daily-quests.input";

const adminDailyQuestSelect = {
  id: true,
  code: true,
  description: true,
  karmaReward: true,
  requirement: true,
  isActive: true,
  createById: true,
  createdAt: true,
} satisfies Prisma.DailyQuestSelect;

type AdminDailyQuestRow = Prisma.DailyQuestGetPayload<{
  select: typeof adminDailyQuestSelect;
}>;

class DailyQuestRepository
  implements IPagination<Prisma.DailyQuestWhereInput, AdminDailyQuestRow> {
  findAll({
    page,
    limit,
    where,
    props,
  }: {
    page: number;
    limit: number;
    where?: Prisma.DailyQuestWhereInput;
    props?: {
      orderBy?: Prisma.DailyQuestOrderByWithRelationInput[];
    };
  }): Promise<AdminDailyQuestRow[]> {
    const { offset, currentLimit } = buildPagination({ page, limit });

    return prisma.dailyQuest.findMany({
      where,
      skip: offset,
      take: currentLimit,
      orderBy: props?.orderBy,
      select: adminDailyQuestSelect,
    });
  }

  count({
    where,
  }: {
    where?: Prisma.DailyQuestWhereInput;
    props?: any;
  }): Promise<number> {
    return prisma.dailyQuest.count({ where });
  }

  async createDailyQuest(input: CreateDailyQuestInput) {
    return prisma.dailyQuest.create({
      data: {
        code: input.code,
        description: input.description,
        karmaReward: input.karmaReward,
        requirement: input.requirement,
        createById: input.createById,
      },
      select: adminDailyQuestSelect,
    });
  }

  async getActiveDailyQuests(input: GetAdminDailyQuestsInput) {
    return this.findAll({
      page: input.page,
      limit: input.limit,
      where: {
        isActive: true,
      },
      props: {
        orderBy: [{ createdAt: "desc" }],
      },
    });
  }

  async countActiveDailyQuests({ where }: { where?: Prisma.DailyQuestWhereInput } = {}) {
    return this.count({
      where: {
        isActive: true,
        ...(where ?? {}),
      },
      props: {},
    });
  }

  async disableDailyQuest(code: string) {
    return prisma.dailyQuest.update({
      where: {
        code,
      },
      data: {
        isActive: false,
      },
      select: adminDailyQuestSelect,
    });
  }
}

export const dailyQuestRepository = new DailyQuestRepository();
