import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

type QuestDbClient = Prisma.TransactionClient | typeof prisma;

const activeDailyQuestSelect = {
  id: true,
  code: true,
  description: true,
  karmaReward: true,
  requirement: true,
  action: true,
} satisfies Prisma.DailyQuestSelect;

export type ActiveDailyQuest = Prisma.DailyQuestGetPayload<{
  select: typeof activeDailyQuestSelect;
}>;

class QuestRepository {
  countActiveDailyQuests(tx: QuestDbClient = prisma) {
    return tx.dailyQuest.count({
      where: {
        isActive: true,
      },
    });
  }

  findActiveDailyQuests(
    {
      excludeQuestIds,
    }: {
      excludeQuestIds?: number[];
    } = {},
    tx: QuestDbClient = prisma,
  ) {
    return tx.dailyQuest.findMany({
      where: {
        isActive: true,
        ...(excludeQuestIds && excludeQuestIds.length > 0
          ? {
            id: {
              notIn: excludeQuestIds,
            },
          }
          : {}),
      },
      orderBy: [{ id: "asc" }],
      select: activeDailyQuestSelect,
    });
  }
}

export const questRepository = new QuestRepository();
