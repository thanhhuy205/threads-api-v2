import prisma from "@/config/prisma";
import type {
  FriendRequest,
  FriendRequestStatus,
  Prisma,
} from "@prisma/client";

class FriendRequestRepository implements ICursorPagination<
  Prisma.FriendRequestWhereInput,
  unknown
> {
  findAll({
    after,
    take,
    where,
    props: {},
  }: {
    after?: string;
    take?: number;
    where?: Prisma.FriendRequestWhereInput;
    props?: any;
  }): Promise<FriendRequest[]> {
    return Promise.resolve([]);
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
