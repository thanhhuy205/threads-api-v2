import { circleExpLogRepository } from "@/modules/circle/repository/circle-exp-log.repository";
import { ExpReason, Prisma } from "@prisma/client";

type GrantMemberJoinExpInput = {
  circleId: number;
  userId: string;
  tx?: Prisma.TransactionClient;
};

type UpsertPostQualityExpLogInput = {
  userId: string;
  circleId: number;
  postId: number;
  expReason: ExpReason;
  expDelta: number;
  isDelta?: boolean;
  tx?: Prisma.TransactionClient;
};

class CircleExpLogService {
  async grantMemberJoinExpIfFirstTime({
    circleId,
    userId,
    tx,
  }: GrantMemberJoinExpInput) {
    const existingJoinLog = await circleExpLogRepository.findMemberJoinLog(
      circleId,
      userId,
      tx,
    );

    if (existingJoinLog) {
      return null;
    }

    return circleExpLogRepository.create(
      {
        userId,
        circleId,
        expReason: ExpReason.MEMBER_JOIN,
        expDelta: 5,
        isDelta: false,
      },
      tx,
    );
  }

  async upsertPostQualityLog({
    userId,
    circleId,
    postId,
    expReason,
    expDelta,
    isDelta,
    tx,
  }: UpsertPostQualityExpLogInput) {
    return circleExpLogRepository.upsertPostQualityLog(
      {
        userId,
        circleId,
        postId,
        expReason,
        expDelta,
        isDelta,
      },
      tx,
    );
  }
}

export const circleExpLogService = new CircleExpLogService();
