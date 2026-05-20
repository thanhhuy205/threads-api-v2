import prisma from "@/config/prisma";
import { PostScoreLabel, Prisma } from "@prisma/client";

type CreateCirclePostQualityLogInput = {
  circleId: number;
  postId: number;
  score?: number;
  hpDelta?: number;
};

type SaveCirclePostJudgeResultInput = {
  circleId: number;
  postId: number;
  score: number;
  label: PostScoreLabel;
  hpDelta: number;
  expDelta: number;
  reason: string;
  confidence: number;
  isToxic: boolean;
  isSpam: boolean;
};

class CirclePostQualityLogRepository {
  async create(
    data: CreateCirclePostQualityLogInput,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.circlePostQualityLog.create({
      data: {
        circleId: data.circleId,
        postId: data.postId,
        score: data.score,
        hpDelta: data.hpDelta,
      },
    });
  }

  async saveJudgeResult(
    data: SaveCirclePostJudgeResultInput,
    tx: Prisma.TransactionClient = prisma,
  ) {
    const updated = await tx.circlePostQualityLog.updateMany({
      where: {
        circleId: data.circleId,
        postId: data.postId,
      },
      data: {
        score: data.score,
        label: data.label,
        hpDelta: data.hpDelta,
        expDelta: data.expDelta,
        reason: data.reason,
        confidence: data.confidence,
        isToxic: data.isToxic,
        isSpam: data.isSpam,
      },
    });

    if (updated.count > 0) {
      return updated;
    }

    return tx.circlePostQualityLog.create({
      data: {
        circleId: data.circleId,
        postId: data.postId,
        score: data.score,
        label: data.label,
        hpDelta: data.hpDelta,
        expDelta: data.expDelta,
        reason: data.reason,
        confidence: data.confidence,
        isToxic: data.isToxic,
        isSpam: data.isSpam,
      },
    });
  }
}

export const circlePostQualityLogRepository =
  new CirclePostQualityLogRepository();
