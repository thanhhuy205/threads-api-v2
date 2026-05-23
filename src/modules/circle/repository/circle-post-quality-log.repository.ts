import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/pagination";
import { PostScoreLabel, PostType, Prisma } from "@prisma/client";

type CreateCirclePostQualityLogInput = {
  circleMemberId: number;
  circleId: number;
  postId: number;
  score?: number;
  hpDelta?: number;
  userId: string;
};

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
};

class CirclePostQualityLogRepository {
  findByCircleIdPaginated({
    circleId,
    page,
    limit,
  }: {
    circleId: number;
    page: number;
    limit: number;
  }) {
    const { offset, currentLimit } = buildPagination({ page, limit });

    return prisma.circlePostQualityLog.findMany({
      where: {
        circleId,
      },
      skip: offset,
      take: currentLimit,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        circleId: true,
        circleMemberId: true,
        postId: true,
        score: true,
        label: true,
        hpDelta: true,
        expDelta: true,
        reason: true,
        confidence: true,
        createdAt: true,
        circleMember: {
          select: {
            id: true,
            userId: true,
            role: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                username: true,
                avatar: true,
                bio: true,
              },
            },
          },
        },
      },
    });
  }

  countByCircleId(circleId: number) {
    return prisma.circlePostQualityLog.count({
      where: {
        circleId,
      },
    });
  }

  async findByCircleAndPostPublicId(circleId: number, postPublicId: string) {
    return prisma.circlePostQualityLog.findFirst({
      where: {
        circleId,
        post: {
          publicId: postPublicId,
          isDeleted: false,
        },
      },
      select: {
        id: true,
        postId: true,
      },
    });
  }

  private async findCursorEntry(circleId: number, after: string) {
    return prisma.circlePostQualityLog.findFirst({
      where: {
        circleId,
        post: {
          publicId: after,
          isDeleted: false,
          type: PostType.CIRCLE,
        },
      },
      select: {
        id: true,
        expDelta: true,
        createdAt: true,
      },
    });
  }

  async findCirclePosts(params: {
    circleId: number;
    after?: string;
    take: number;
    sort: "latest" | "quality";
  }) {
    const cursorEntry = params.after
      ? await this.findCursorEntry(params.circleId, params.after)
      : null;

    if (params.after && !cursorEntry) {
      return [];
    }

    const where: Prisma.CirclePostQualityLogWhereInput = {
      circleId: params.circleId,
      post: {
        isDeleted: false,
        type: PostType.CIRCLE,
      },
    };

    if (cursorEntry) {
      where.AND =
        params.sort === "quality"
          ? [
            {
              OR: [
                { expDelta: { lt: cursorEntry.expDelta } },
                {
                  AND: [
                    { expDelta: cursorEntry.expDelta },
                    { createdAt: { lt: cursorEntry.createdAt } },
                  ],
                },
                {
                  AND: [
                    { expDelta: cursorEntry.expDelta },
                    { createdAt: cursorEntry.createdAt },
                    { id: { lt: cursorEntry.id } },
                  ],
                },
              ],
            },
          ]
          : [
            {
              OR: [
                { createdAt: { lt: cursorEntry.createdAt } },
                {
                  AND: [
                    { createdAt: cursorEntry.createdAt },
                    { id: { lt: cursorEntry.id } },
                  ],
                },
              ],
            },
          ];
    }

    return prisma.circlePostQualityLog.findMany({
      where,
      take: params.take + 1,
      orderBy:
        params.sort === "quality"
          ? [{ expDelta: "desc" }, { createdAt: "desc" }, { id: "desc" }]
          : [{ createdAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        score: true,
        label: true,
        hpDelta: true,
        expDelta: true,
        reason: true,
        confidence: true,
        isToxic: true,
        isSpam: true,
        createdAt: true,
        post: {
          select: {
            id: true,
            publicId: true,
            userId: true,
            content: true,
            contentJson: true,
            createdAt: true,
            visibility: true,
            replyPermission: true,
            userSnapshot: true
          },
        },
      },
    });
  }

  async create(
    data: CreateCirclePostQualityLogInput,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.circlePostQualityLog.create({
      data: {
        circleMemberId: data.circleMemberId,
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
        userId: data.userId,
        circleMemberId: data.circleMemberId,
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

  async findMemberPostQualityLog(circleId: number) {
    return prisma.circlePostQualityLog.findMany({
      where: {
        circleId,
      },
      select: {
        circleMember: {
          select: {
            userId: true,
            postQualityLogs: {
              where: {
                circleId,
              },
              select: {
                hpDelta: true,
                expDelta: true,
              },
            },
          }
        },
      },
    });
  }
}

export const circlePostQualityLogRepository =
  new CirclePostQualityLogRepository();
