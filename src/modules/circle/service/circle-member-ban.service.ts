import { circleMemberBanRepository } from "@/modules/circle/repository/circle-member-ban.repository";
import { Prisma } from "@prisma/client";

class CircleMemberBanService {
  upsertByCircleIdAndUserId(
    input: {
      circleId: number;
      userId: string;
      bannedById: string;
      reason?: string;
      expiresAt?: Date;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return circleMemberBanRepository.upsertByCircleIdAndUserId(
      input,
      tx as Prisma.TransactionClient,
    );
  }

  findActiveBanByCircleIdAndUserId(
    circleId: number,
    userId: string,
    tx?: Prisma.TransactionClient,
  ) {
    return circleMemberBanRepository.findActiveBanByCircleIdAndUserId(
      circleId,
      userId,
      tx as Prisma.TransactionClient,
    );
  }
}

export const circleMemberBanService = new CircleMemberBanService();
