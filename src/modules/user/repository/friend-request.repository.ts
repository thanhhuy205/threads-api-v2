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
  }: {
    after?: string;
    take?: number;
    where: Prisma.FriendRequestWhereInput;
    cursor?: Prisma.FriendRequestWhereUniqueInput;
  }): Promise<FriendRequest[]> {
    const { currentAfter, currentLimit } = buildPagination({ after, take });

    return prisma.friendRequest.findMany({
      where,
      take: currentLimit + 1,
      skip: currentAfter ? 1 : 0,
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
              senderId: receiverId,
              receiverId: senderId,
            },
          }
        : undefined,
      take,
    });
  }

  async create(senderId: string, receiverId: string) {
    return prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: "PENDING",
      },
    });
  }

  async findBySenderAndReceiver(senderId: string, receiverId: string) {
    return prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
    });
  }

  async findById(id: number) {
    return prisma.friendRequest.findUnique({
      where: { id },
    });
  }

  async updateStatusById(id: number, status: FriendRequestStatus) {
    return prisma.friendRequest.update({
      where: { id },
      data: { status },
    });
  }
}

export const friendRequestRepository = new FriendRequestRepository();
