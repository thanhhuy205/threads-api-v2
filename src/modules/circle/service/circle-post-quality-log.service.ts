import { circlePostQualityLogRepository } from "@/modules/circle/repository/circle-post-quality-log.repository";
import { PostScoreLabel, Prisma } from "@prisma/client";

type SaveCirclePostJudgeResultInput = {
  circleMemberId: number;
  userId: string;
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
  tx?: Prisma.TransactionClient;
};

class CirclePostQualityLogService {
  async saveJudgeResult({
    circleMemberId,
    userId,
    circleId,
    postId,
    score,
    label,
    hpDelta,
    expDelta,
    reason,
    confidence,
    isToxic,
    isSpam,
    tx,
  }: SaveCirclePostJudgeResultInput) {
    return circlePostQualityLogRepository.saveJudgeResult(
      {
        circleMemberId,
        userId,
        circleId,
        postId,
        score,
        label,
        hpDelta,
        expDelta,
        reason,
        confidence,
        isToxic,
        isSpam,
      },
      tx,
    );
  }
}

export const circlePostQualityLogService = new CirclePostQualityLogService();
