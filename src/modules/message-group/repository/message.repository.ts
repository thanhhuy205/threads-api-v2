import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/cursor-pagination";
import { Prisma, StatusMessage } from "@prisma/client";

const messageSelect = {
  publicId: true,
  messageGroup: {
    select: {
      publicId: true,
    },
  },
  senderId: true,
  content: true,
  statusMessage: true,
  createdAt: true,

} satisfies Prisma.MessageSelect;

class MessageRepository
  implements ICursorPagination<Prisma.MessageWhereInput, Prisma.MessageGetPayload<{ select: typeof messageSelect }>> {
  findAll({
    after,
    take,
    where,
    cursor,
  }: {
    after?: string;
    take: number;
    where?: Prisma.MessageWhereInput;
    cursor?: Prisma.MessageWhereUniqueInput;
  }) {
    const { currentAfter, currentLimit } = buildPagination({ after, take });

    return prisma.message.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: currentLimit ? currentLimit + 1 : undefined,
      skip: currentAfter ? 1 : 0,
      cursor: currentAfter ? cursor : undefined,
      select: messageSelect,
    });
  }

  create(
    data: {
      messageGroupId: number;
      senderId: string;
      content: string;
      statusMessage: StatusMessage;
    },
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.message.create({
      data,
      select: messageSelect,
    });
  }

  findByPublicIdAndGroupId(publicId: string, messageGroupId: number) {
    return prisma.message.findFirst({
      where: {
        publicId,
        messageGroupId,
      },
      select: {
        id: true,
        publicId: true,
      },
    });
  }

  async updateStatusByPublicIdAndGroupId(
    publicId: string,
    messageGroupId: number,
    statusMessage: StatusMessage,
    tx: Prisma.TransactionClient = prisma,
  ) {
    const message = await tx.message.findFirst({
      where: {
        publicId,
        messageGroupId,
      },
      select: {
        id: true,
      },
    });

    if (!message) {
      return null;
    }

    return tx.message.update({
      where: {
        id: message.id,
      },
      data: {
        statusMessage,
      },
      select: messageSelect,
    });
  }

  findMessagesByGroupIdAndPublicId(
    messageGroupId: number,
    messagePublicId: string | undefined,
    take: number,
  ) {
    return this.findAll({
      after: messagePublicId ? messagePublicId : undefined,
      take,
      where: {
        messageGroupId,
      },
      cursor: messagePublicId ? { publicId: messagePublicId } : undefined,
    });
  }

  updateMessageStatusByUserId(userId: string, status: StatusMessage, tx: Prisma.TransactionClient = prisma) {
    return tx.message.updateMany({
      where: {
        senderId: userId,
        statusMessage: {
          notIn: [StatusMessage.READ, StatusMessage.FAILED],
        },
      },
      data: {
        statusMessage: status,
        lastSeenAt: new Date(),
      },

    });
  }

}

export const messageRepository = new MessageRepository();
