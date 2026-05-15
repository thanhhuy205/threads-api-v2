import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/cursor-pagination";
import { Prisma } from "@prisma/client";

const memberMessageGroupSelect = {
  id: true,
  user: {
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
    },
  },
} satisfies Prisma.MemberMessageGroupSelect;

class MemberMessageGroupRepository {
  createMany(
    data: {
      messageGroupId: number;
      userId: string;
    }[],
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.memberMessageGroup.createMany({
      data,
      skipDuplicates: true,
    });
  }

  findByGroupIdAndUserId(messageGroupId: number, userId: string) {
    return prisma.memberMessageGroup.findUnique({
      where: {
        messageGroupId_userId: {
          messageGroupId,
          userId,
        },
      },
    });
  }

  findByGroupId({
    messageGroupId,
    after,
    take,
  }: {
    messageGroupId: number;
    after?: string;
    take: number;
  }) {
    const { currentAfter, currentLimit } = buildPagination({ after, take });

    return prisma.memberMessageGroup.findMany({
      where: {
        messageGroupId,
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      take: currentLimit + 1,
      skip: currentAfter ? 1 : 0,
      cursor: currentAfter ? { id: currentAfter } : undefined,
      select: memberMessageGroupSelect,
    });
  }
}

export const memberMessageGroupRepository =
  new MemberMessageGroupRepository();
