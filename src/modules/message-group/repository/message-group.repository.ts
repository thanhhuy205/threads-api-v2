import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/cursor-pagination";
import { GroupType, Prisma } from "@prisma/client";

const messageGroupSelect = {
  id: true,
  publicId: true,
  name: true,
  groupType: true,
  lastMessageAt: true,
  createdAt: true,
  members: {
    select: {
      id: true,
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
        },
      },
      unreadCount: true,
    },
  },
} satisfies Prisma.MessageGroupSelect;

class MessageGroupRepository {
  create(
    data: {
      groupType: GroupType;
      createdById: string;
      lastMessageAt: Date;
    },
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.messageGroup.create({
      data,
      select: messageGroupSelect,
    });
  }

  createWithMembers(
    data: {
      groupType: GroupType;
      createdById: string;
      lastMessageAt: Date;
    },
    memberIds: string[],
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.messageGroup.create({
      data: {
        ...data,
        members: {
          createMany: {
            data: memberIds.map((userId) => ({
              userId,
            })),
          },
        },
      },
      select: messageGroupSelect,
    });
  }


  findByPublicId(publicId: string, tx: Prisma.TransactionClient = prisma) {
    return tx.messageGroup.findUnique({
      where: {
        publicId,
      },
      select: messageGroupSelect,
    });
  }

  updateLastMessageAt(
    id: number,
    lastMessageAt: Date,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.messageGroup.update({
      where: {
        id,
      },
      data: {
        lastMessageAt,
      },
      select: messageGroupSelect,
    });
  }

  findPrivateGroupByUserIds(userIds: string[], tx: Prisma.TransactionClient = prisma) {
    return tx.messageGroup.findFirst({
      where: {
        groupType: GroupType.PRIVATE,
        members: {
          every: {
            userId: {
              in: userIds,
            },
          },
        },
      },
      select: messageGroupSelect,
    });
  }

  findByUserId(
    {
      userId,
      after,
      take,
      groupTypes = [GroupType.PRIVATE, GroupType.CROWD],
    }: {
      userId: string;
      after?: string;
      take: number;
      groupTypes?: GroupType[];
    },
    tx: Prisma.TransactionClient = prisma,
  ) {
    const { currentAfter, currentLimit } = buildPagination({ after, take });

    return tx.messageGroup.findMany({
      where: {
        groupType: {
          in: groupTypes,
        },
        members: {
          some: {
            userId,
          },
        },
      },
      orderBy: [{ lastMessageAt: "desc" }, { publicId: "desc" }],
      take: currentLimit + 1,
      skip: currentAfter ? 1 : 0,
      cursor: currentAfter ? { publicId: currentAfter } : undefined,
      select: messageGroupSelect,
    });
  }

  countUnreadGroupsByUserId(userId: string) {
    return prisma.messageGroup.count({
      where: {
        members: {
          some: {
            userId,
            unreadCount: {
              gt: 0,
            },
          },
        },
      },
    });
  }


  findUserExistingPrivateGroup(userId: string, groupPublicId: string, tx: Prisma.TransactionClient = prisma) {
    return tx.messageGroup.findFirst({
      where: {
        publicId: groupPublicId,
        groupType: GroupType.PRIVATE,
        members: {
          some: {
            userId
          },
        }
      },
      select: messageGroupSelect,
    });
  }
}

export const messageGroupRepository = new MessageGroupRepository();
