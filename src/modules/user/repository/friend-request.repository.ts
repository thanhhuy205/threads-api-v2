import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/cursor-pagination";
import { FriendRequest, FriendRequestStatus, Prisma } from "@prisma/client";

class FriendRequestRepository implements ICursorPagination<
  Prisma.FriendRequestWhereInput,
  unknown
> {
  findAll({
    after,
    take,
    where,
    cursor,
    select,
  }: {
    after?: string;
    take?: number;
    where: Prisma.FriendRequestWhereInput;
    cursor?: Prisma.FriendRequestWhereUniqueInput;
    select?: Prisma.FriendRequestSelect;
  }): Promise<FriendRequest[]> {
    const { currentAfter, currentLimit } = buildPagination({ after, take });

    return prisma.friendRequest.findMany({
      where,
      take: currentLimit + 1,
      skip: currentAfter ? 1 : 0,
      select,
      cursor: currentAfter ? cursor : undefined,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
  }

  async findReceivedPending({
    receiverId,
    senderId,
    take,
  }: {
    receiverId: string;
    senderId: string | undefined;
    take: number;
  }) {
    return this.findAll({
      where: {
        receiverId,
        status: FriendRequestStatus.PENDING,
      },
      after: senderId,
      cursor: senderId
        ? { senderId_receiverId: { senderId, receiverId } }
        : undefined,
      take,
      select: {
        id: true,
        status: true,
        createdAt: true,
        senderId: true,
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findSentPending({
    senderId,
    receiverId,
    take,
  }: {
    senderId: string;
    receiverId: string | undefined;
    take: number;
  }) {
    return this.findAll({
      where: {
        senderId,
        status: FriendRequestStatus.PENDING,
      },
      after: receiverId,
      cursor: receiverId
        ? {
            senderId_receiverId: {
              senderId,
              receiverId,
            },
          }
        : undefined,
      select: {
        id: true,
        status: true,
        createdAt: true,
        receiverId: true,
        receiver: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
      take,
    });
  }

  async create(
    senderId: string,
    receiverId: string,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: "PENDING",
      },
    });
  }

  async findBySenderAndReceiver(
    senderId: string,
    receiverId: string,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
    });
  }

  async findById(id: number, tx: Prisma.TransactionClient = prisma) {
    return tx.friendRequest.findUnique({
      where: { id },
    });
  }

  async updateStatusById(
    id: number,
    status: FriendRequestStatus,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.friendRequest.update({
      where: { id },
      data: { status },
    });
  }
}

export const friendRequestRepository = new FriendRequestRepository();
