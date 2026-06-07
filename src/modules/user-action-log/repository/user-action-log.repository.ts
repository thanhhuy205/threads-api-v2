import prisma from "@/config/prisma";
import { ActionType, Prisma } from "@prisma/client";

type UserActionLogDbClient = Prisma.TransactionClient | typeof prisma;

export type CreateUserActionLogInput = {
  userId: string;
  type: ActionType;
  targetId: string;
  metadata?: Prisma.InputJsonValue;
};

class UserActionLogRepository {
  create(input: CreateUserActionLogInput, tx: UserActionLogDbClient = prisma) {
    return tx.userActionLog.upsert({
      where: {
        userId_type_targetId: {
          userId: input.userId,
          type: input.type,
          targetId: input.targetId,
        },
      },
      create: {
        userId: input.userId,
        type: input.type,
        targetId: input.targetId,
        metadata: input.metadata,
      },
      update: {
        metadata: input.metadata,
      },
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

  findActionInPost(params: {
    userId: string | string[];
    postPublicId: string;
    actionType: ActionType;
  }) {
    return prisma.userActionLog.findMany({
      where: {
        userId: Array.isArray(params.userId) ? { in: params.userId } : params.userId,
        type: params.actionType,
        targetId: params.postPublicId,
      },
    });
  }
}

export const userActionLogRepository = new UserActionLogRepository();
