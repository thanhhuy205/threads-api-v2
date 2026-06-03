import prisma from "@/config/prisma";
import { ActionType, Prisma } from "@prisma/client";

type UserActionLogDbClient = Prisma.TransactionClient | typeof prisma;

export type CreateUserActionLogInput = {
  userId: string;
  type: ActionType;
  targetId?: string;
  metadata?: Prisma.InputJsonValue;
};

const userActionLogSelect = {
  id: true,
  userId: true,
  type: true,
  targetId: true,
  metadata: true,
  createdAt: true,
} satisfies Prisma.UserActionLogSelect;

class UserActionLogRepository {
  create(
    input: CreateUserActionLogInput,
    tx: UserActionLogDbClient = prisma,
  ) {
    return tx.userActionLog.create({
      data: {
        userId: input.userId,
        type: input.type,
        targetId: input.targetId,
        ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
      },
      select: userActionLogSelect,
    });
  }

  countByType(params: {
    userId: string;
    type: ActionType;
  }
  ) {
    return prisma.userActionLog.count({
      where: {
        userId: params.userId,
        type: params.type,
      },
    });
  }

  async countByTypeInWindow(
    {
      userId,
      startAt,
      endAt,
    }: {
      userId: string;
      startAt: Date;
      endAt: Date;
    },
    tx: UserActionLogDbClient = prisma,
  ) {
    const grouped = await tx.userActionLog.groupBy({
      by: ["type"],
      where: {
        userId,
        createdAt: {
          gte: startAt,
          lt: endAt,
        },
      },
      _count: {
        _all: true,
      },
    });

    const counts = new Map<ActionType, number>();
    for (const row of grouped) {
      counts.set(row.type, row._count._all);
    }

    return counts;
  }
}

export const userActionLogRepository = new UserActionLogRepository();
