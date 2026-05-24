import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

type QuestLogDbClient = Prisma.TransactionClient | typeof prisma;

const userQuestLogSelect = {
  id: true,
  userId: true,
  questId: true,
  progress: true,
  completed: true,
  claimedAt: true,
  date: true,
  quest: {
    select: {
      code: true,
      description: true,
      action: true,
      requirement: true,
      karmaReward: true,
    },
  },
} satisfies Prisma.UserQuestLogSelect;

export type UserQuestLogWithQuest = Prisma.UserQuestLogGetPayload<{
  select: typeof userQuestLogSelect;
}>;

type CreateQuestLogInput = {
  userId: string;
  questId: number;
  date: Date;
};

class UserQuestLogRepository {
  lockUserRow(userId: string, tx: QuestLogDbClient = prisma) {
    return tx.$queryRaw<{ id: string }[]>`
      SELECT id
      FROM users
      WHERE id = ${userId}
      FOR UPDATE
    `;
  }

  findLogsByUserAndDate(
    userId: string,
    date: Date,
    tx: QuestLogDbClient = prisma,
  ) {
    return tx.userQuestLog.findMany({
      where: {
        userId,
        date,
      },
      orderBy: [{ id: "asc" }],
      select: userQuestLogSelect,
    });
  }

  createManyLogs(
    logs: CreateQuestLogInput[],
    tx: QuestLogDbClient = prisma,
  ) {
    if (logs.length === 0) {
      return Promise.resolve({ count: 0 });
    }

    return tx.userQuestLog.createMany({
      data: logs.map((log) => ({
        userId: log.userId,
        questId: log.questId,
        date: log.date,
      })),
      skipDuplicates: true,
    });
  }

  updateProgress(
    {
      id,
      progress,
      completed,
    }: {
      id: number;
      progress: number;
      completed: boolean;
    },
    tx: QuestLogDbClient = prisma,
  ) {
    return tx.userQuestLog.update({
      where: {
        id,
      },
      data: {
        progress,
        completed,
      },
      select: {
        id: true,
      },
    });
  }
}

export const userQuestLogRepository = new UserQuestLogRepository();
