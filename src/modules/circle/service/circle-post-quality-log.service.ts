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
  findByCircleIdPaginated({
    circleId,
    page,
    limit,
  }: {
    circleId: number;
    page: number;
    limit: number;
  }) {
    return circlePostQualityLogRepository.findByCircleIdPaginated({
      circleId,
      page,
      limit,
    });
  }

  countByCircleId(circleId: number) {
    return circlePostQualityLogRepository.countByCircleId(circleId);
  }

  findByCircleAndPostPublicId(circleId: number, postPublicId: string) {
    return circlePostQualityLogRepository.findByCircleAndPostPublicId(
      circleId,
      postPublicId,
    );
  }

  findCirclePosts(params: {
    circleId: number;
    after?: string;
    take: number;
    sort: "latest" | "quality";
  }) {
    return circlePostQualityLogRepository.findCirclePosts(params);
  }

  create(
    data: {
      circleMemberId: number;
      circleId: number;
      postId: number;
      score?: number;
      hpDelta?: number;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return circlePostQualityLogRepository.create(
      data,
      tx as Prisma.TransactionClient,
    );
  }

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
