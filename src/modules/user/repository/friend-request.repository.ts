import prisma from "@/config/prisma";
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
    return prisma.friendRequest.findMany({
      where,
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
  }

  async findReceivedPending({
    receiverId,
    cursor,
    take,
  }: {
    receiverId: string;
    cursor?: { senderId: string };
    take: number;
  }) {
    return this.findAll({
      where: {
        receiverId,
        status: FriendRequestStatus.PENDING,
      },
      cursor: cursor
        ? { senderId_receiverId: { senderId: cursor.senderId, receiverId } }
        : undefined,
      take,
    });
  }

  async findSentPending({
    senderId,
    cursor,
    take,
  }: {
    senderId: string;
    cursor?: { receiverId: string };
    take: number;
  }) {
    return this.findAll({
      where: {
        senderId,
        status: FriendRequestStatus.PENDING,
      },
      cursor: cursor
        ? {
            senderId_receiverId: {
              senderId: cursor.receiverId,
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
