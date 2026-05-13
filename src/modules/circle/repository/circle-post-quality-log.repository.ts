import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

type CreateCirclePostQualityLogInput = {
  circleId: number;
  postId: number;
  score?: number;
  hpDelta?: number;
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
}

export const circlePostQualityLogRepository =
  new CirclePostQualityLogRepository();
