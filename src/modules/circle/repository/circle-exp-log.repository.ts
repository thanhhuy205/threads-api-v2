import prisma from "@/config/prisma";
import { ExpReason, Prisma } from "@prisma/client";

type CreateCircleExpLogInput = {
  userId: string;
  circleId: number;
  expReason: ExpReason;
  expDelta: number;
  postId?: number | null;
  isDelta?: boolean;
};

type CreatePostQualityExpLogInput = {
  userId: string;
  circleId: number;
  postId: number;
  expReason: ExpReason;
  expDelta: number;
  isDelta?: boolean;
};

class CircleExpLogRepository implements ICursorPagination<Prisma.CircleExpLogWhereInput, any> {
  findAll({ after, take, where }: { after?: string; take?: number; where?: any; }): Promise<any[]> {
    return prisma.circleExpLog.findMany({
      where,
      take: after && take ? take + 1 : take,
      skip: after ? 1 : 0,
      cursor: after ? { publicId: after } : undefined,
      orderBy: {
        createdAt: "desc",
        id: "desc",
      },
    });
  }
  async create(
    data: CreateCircleExpLogInput,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.circleExpLog.create({
      data: {
        userId: data.userId,
        circleId: data.circleId,
        postId: data.postId ?? null,
        expReason: data.expReason,
        expDelta: data.expDelta,
        isDelta: data.isDelta ?? false,
      },
    });
  }

  async findExpLogsByCircleId(
    {
      circleId,
      after,
      take,
    }: {
      circleId: number;
      after?: string;
      take?: number;
    }
  ) {
    return this.findAll({ after, take, where: { circleId } });
  }

  async findMemberJoinLog(
    circleId: number,
    userId: string,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.circleExpLog.findFirst({
      where: {
        circleId,
        userId,
        expReason: ExpReason.MEMBER_JOIN,
      },
      select: {
        id: true,
      },
    });
  }

  async upsertPostQualityLog(
    data: CreatePostQualityExpLogInput,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.circleExpLog.upsert({
      where: {
        circleId_postId_expReason: {
          circleId: data.circleId,
          postId: data.postId,
          expReason: data.expReason,
        },
      },
      update: {
        userId: data.userId,
        expDelta: data.expDelta,
        isDelta: data.isDelta ?? false,
      },
      create: {
        userId: data.userId,
        circleId: data.circleId,
        postId: data.postId,
        expReason: data.expReason,
        expDelta: data.expDelta,
        isDelta: data.isDelta ?? false,
      },
    });
  }
}

export const circleExpLogRepository = new CircleExpLogRepository();
