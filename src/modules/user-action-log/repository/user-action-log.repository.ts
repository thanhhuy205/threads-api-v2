import prisma from "@/config/prisma";
import { ActionType, Prisma } from "@prisma/client";

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
    tx: Prisma.TransactionClient = prisma,
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
}

export const userActionLogRepository = new UserActionLogRepository();
