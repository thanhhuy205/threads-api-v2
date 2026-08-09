import { USER_MESSAGE } from "@/constants/message";
import { Injectable, Logger } from '@nestjs/common';
import { NotFoundException } from "@/errors/error";
import { UserRepository, userRepository as legacyUserRepository } from "@/modules/user/repository/user.repository";
import { buildCursorPagination, type CursorPaginationMeta } from '@/common/helpers/cursor-pagination.helper';
import { TransactionService } from "@/shared/transaction/transaction.service";
import { FriendRequestStatus } from "@prisma/client";
import { FriendRequestRepository, friendRequestRepository as legacyFriendRequestRepository } from "../repository/friend-request.repository";

type FriendRequestResponse = {
  sendFriends: boolean;
};

type FriendRequestPaginationResult = {
  rows: unknown[];
  pagination: CursorPaginationMeta;
};

@Injectable()
export class FriendService {
  private readonly logger = new Logger(FriendService.name, { timestamp: true });

  constructor(
    private readonly userRepository: UserRepository = legacyUserRepository,
    private readonly friendRequestRepository: FriendRequestRepository = legacyFriendRequestRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async sendFriendRequest(
    userId: string,
    targetUsername: string,
  ): Promise<FriendRequestResponse> {
    const targetUser = await this.userRepository.findByUsername(targetUsername);
    if (!targetUser) {
      return { sendFriends: false };
    }

    const receiver = await this.userRepository.findById(targetUser.id);
    if (!receiver) {
      return { sendFriends: false };
    }

    await this.friendRequestRepository.upsert(userId, targetUser.id);
    return { sendFriends: true };
  }

  async handleFriendRequestCancel(userId: string, receiverUsername: string) {
    this.logger.log(
      `handleFriendRequest receiverUsername: ${receiverUsername}`,
    );
    return this.transactionService.doInTransaction(async (tx) => {
      const receiver = await this.userRepository.findByUsername(
        receiverUsername,
        tx,
      );
      if (!receiver) {
        this.logger.log(USER_MESSAGE.USER_NOT_FOUND);
        throw new NotFoundException(USER_MESSAGE.USER_NOT_FOUND);
      }

      const friendRequest =
        await this.friendRequestRepository.findBySenderAndReceiver({
          senderId: userId,
          receiverId: receiver.id,
        });

      if (!friendRequest) {
        throw new NotFoundException(USER_MESSAGE.FRIEND_REQUEST_NOT_FOUND);
      }

      await this.friendRequestRepository.updateStatusById(
        friendRequest.id,
        FriendRequestStatus.CANCELLED,
        tx,
      );
    });
  }

  async handleFriendRequestAccept(
    userId: string,
    senderUsername: string,
    isAccept: boolean,
  ) {
    this.logger.log(`handleFriendRequest senderUsername: ${senderUsername}`);
    return this.transactionService.doInTransaction(async (tx) => {
      const sender = await this.userRepository.findByUsername(senderUsername, tx);
      if (!sender) {
        this.logger.log(USER_MESSAGE.USER_NOT_FOUND);
        throw new NotFoundException(USER_MESSAGE.USER_NOT_FOUND);
      }

      const friendRequest =
        await this.friendRequestRepository.findBySenderAndReceiver({
          senderId: sender.id,
          receiverId: userId,
        });

      if (!friendRequest) {
        throw new NotFoundException(USER_MESSAGE.FRIEND_REQUEST_NOT_FOUND);
      }

      if (isAccept) {
        await this.friendRequestRepository.updateStatusById(
          friendRequest.id,
          FriendRequestStatus.ACCEPTED,
          tx,
        );
      } else {
        await this.friendRequestRepository.updateStatusById(
          friendRequest.id,
          FriendRequestStatus.REJECTED,
          tx,
        );
      }
    });
  }

  async getReceivedFriendRequests({
    senderId,
    receiverId,
    take,
  }: {
    senderId?: string;
    receiverId: string;
    take: number;
  }): Promise<FriendRequestPaginationResult> {
    const friendRequests = await this.friendRequestRepository.findReceivedPending({
      receiverId,
      senderId: senderId ?? undefined,
      take,
    });

    return buildCursorPagination({
      rows: friendRequests,
      take,
      getAfter: (fr) => fr.senderId,
    });
  }

  async getSentFriendRequests({
    senderId,
    receiverId,
    take,
  }: {
    senderId: string;
    receiverId?: string;
    take: number;
  }): Promise<FriendRequestPaginationResult> {
    const friendRequests = await this.friendRequestRepository.findSentPending({
      senderId,
      receiverId: receiverId ?? undefined,
      take,
    });

    return buildCursorPagination({
      rows: friendRequests,
      take,
      getAfter: (fr) => fr.receiverId,
    });
  }

  countReceivedFriendRequests(receiverId: string) {
    return this.friendRequestRepository.countReceivedPending(receiverId);
  }
}
