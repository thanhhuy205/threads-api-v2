import { PrismaService } from '@/shared/database/prisma.service';
import { normalizeCursorPagination } from '@/common/helpers/cursor-pagination.helper';
import { Injectable, Logger } from '@nestjs/common';
import { FriendRequest, FriendRequestStatus, Prisma } from "@prisma/client";

@Injectable()
export class FriendRequestRepository {
  private readonly logger = new Logger(FriendRequestRepository.name, { timestamp: true });

  constructor(private readonly prisma: PrismaService) { }

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
    const { after: currentAfter, take: currentLimit } = normalizeCursorPagination({ after, take });

    return this.prisma.friendRequest.findMany({
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

  countReceivedPending(receiverId: string) {
    return this.prisma.friendRequest.count({
      where: {
        receiverId,
        status: FriendRequestStatus.PENDING,
      },
    });
  }

  async upsert(
    senderId: string,
    receiverId: string,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).friendRequest.upsert({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
      create: {
        senderId,
        receiverId,
        status: "PENDING",
      },
      update: {
        status: "PENDING",
      },
    });
  }

  async findBySenderAndReceiver(
    { senderId, receiverId }: { senderId: string; receiverId: string },
    tx?: Prisma.TransactionClient,
  ) {
    this.logger.log(`UserId ${receiverId}`);
    this.logger.log(`SenderId ${senderId}`);
    return (tx ?? this.prisma).friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
    });
  }

  async findById(id: number, tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).friendRequest.findUnique({
      where: { id },
    });
  }

  async updateStatusById(
    id: number,
    status: FriendRequestStatus,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).friendRequest.update({
      where: { id },
      data: { status },
    });
  }
}

