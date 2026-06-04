import { heroBadgeRepository } from "@/modules/circle/repository/hero-badge.repository";
import { karmaTransactionRepository } from "@/modules/circle/repository/karma-transaction.repository";
import { userKarmaRepository } from "@/modules/circle/repository/user-karma.repository";
import { BadgeType, KarmaReason, Prisma } from "@prisma/client";

class CircleKarmaService {
  getTotalKarmaByUserId(userId: string, tx?: Prisma.TransactionClient) {
    return userKarmaRepository.getTotalKarmaByUserId(
      userId,
      tx as Prisma.TransactionClient,
    );
  }

  decrementKarma(userId: string, amount: number, tx?: Prisma.TransactionClient) {
    return userKarmaRepository.decrementKarma(
      userId,
      amount,
      tx as Prisma.TransactionClient,
    );
  }

  createTransaction(
    data: {
      userId: string;
      circleId: number;
      delta: number;
      reason: KarmaReason;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return karmaTransactionRepository.create(
      data,
      tx as Prisma.TransactionClient,
    );
  }

  upsertHeroBadge(
    data: {
      userId: string;
      circleId: number;
      type: BadgeType;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return heroBadgeRepository.upsert(data, tx as Prisma.TransactionClient);
  }
}

export const circleKarmaService = new CircleKarmaService();
