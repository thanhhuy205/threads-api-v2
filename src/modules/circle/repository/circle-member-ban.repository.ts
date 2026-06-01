import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

class CircleMemberBanRepository {
  async upsertByCircleIdAndUserId(
    input: {
      circleId: number;
      userId: string;
      bannedById: string;
      reason?: string;
      expiresAt?: Date;
    },
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.circleMemberBan.upsert({
      where: {
        circleId_userId: {
          circleId: input.circleId,
          userId: input.userId,
        },
      },
      update: {
        bannedById: input.bannedById,
        reason: input.reason,
        expiresAt: input.expiresAt,
      },
      create: {
        circleId: input.circleId,
        userId: input.userId,
        bannedById: input.bannedById,
        reason: input.reason,
        expiresAt: input.expiresAt,
      },
    });
  }

  async findActiveBanByCircleIdAndUserId(
    circleId: number,
    userId: string,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.circleMemberBan.findFirst({
      where: {
        circleId,
        userId,
        OR: [
          {
            expiresAt: null,
          },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
    });
  }
}

export const circleMemberBanRepository = new CircleMemberBanRepository();
