import prisma from "@/config/prisma";
import { GroupType, Prisma } from "@prisma/client";

const messageGroupSelect = {
  id: true,
  publicId: true,
  name: true,
  groupType: true,
  createdById: true,
  lastMessageAt: true,
  createdAt: true,
  updatedAt: true,
  members: {
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
        },
      },
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

  findByPublicId(publicId: string) {
    return prisma.messageGroup.findUnique({
      where: {
        publicId,
      },
      select: messageGroupSelect,
    });
  }

  updateLastMessageAt(
    id: string,
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
}

export const messageGroupRepository = new MessageGroupRepository();
