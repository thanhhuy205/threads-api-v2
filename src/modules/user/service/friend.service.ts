import { USER_MESSAGE } from "@/constants/message";
import { NotFoundException } from "@/errors/error";
import { baseLogger } from "@/middlewares/logger";
import { messageGroupFacadeService } from "@/modules/message-group/service/message-group-facade.service";
import { userRepository } from "@/modules/user/repository/user.repository";
import {
  buildCursorPagination,
  type PaginationResponse,
} from "@/shared/pagination/cursor-pagination";
import { transactionService } from "@/shared/transaction/transaction.service";
import { FriendRequestStatus, GroupType } from "@prisma/client";
import { friendRequestRepository } from "../repository/friend-request.repository";

type FriendRequestResponse = {
  sendFriends: boolean;
};

type FriendRequestPaginationResult = {
  rows: unknown[];
  pagination: PaginationResponse<string | number | null>;
};

class FriendService {
  async sendFriendRequest(
    userId: string,
    targetUsername: string,
  ): Promise<FriendRequestResponse> {
    const targetUser = await userRepository.findByUsername(targetUsername);
    if (!targetUser) {
      return { sendFriends: false };
    }

    const receiver = await userRepository.findById(targetUser.id);
    if (!receiver) {
      return { sendFriends: false };
    }

    await friendRequestRepository.upsert(userId, targetUser.id);
    return { sendFriends: true };
  }

  async handleFriendRequestCancel(userId: string, receiverUsername: string) {
    baseLogger.info(
      `handleFriendRequest receiverUsername: ${receiverUsername}`,
    );
    return transactionService.doInTransaction(async (tx) => {
      const receiver = await userRepository.findByUsername(
        receiverUsername,
        tx,
      );
      if (!receiver) {
        baseLogger.info(USER_MESSAGE.USER_NOT_FOUND);
        throw new NotFoundException(USER_MESSAGE.USER_NOT_FOUND);
      }

      const friendRequest =
        await friendRequestRepository.findBySenderAndReceiver({
          senderId: userId,
          receiverId: receiver.id,
        });

      if (!friendRequest) {
        throw new NotFoundException(USER_MESSAGE.FRIEND_REQUEST_NOT_FOUND);
      }

      await friendRequestRepository.updateStatusById(
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
    baseLogger.info(`handleFriendRequest senderUsername: ${senderUsername}`);
    return transactionService.doInTransaction(async (tx) => {
      const sender = await userRepository.findByUsername(senderUsername, tx);
      if (!sender) {
        baseLogger.info(USER_MESSAGE.USER_NOT_FOUND);
        throw new NotFoundException(USER_MESSAGE.USER_NOT_FOUND);
      }

      const friendRequest =
        await friendRequestRepository.findBySenderAndReceiver({
          senderId: sender.id,
          receiverId: userId,
        });

      if (!friendRequest) {
        throw new NotFoundException(USER_MESSAGE.FRIEND_REQUEST_NOT_FOUND);
      }

      if (isAccept) {
        await messageGroupFacadeService.createPrivateMessageGroup(
          sender.id,
          userId,
          tx,
        );
        await friendRequestRepository.updateStatusById(
          friendRequest.id,
          FriendRequestStatus.ACCEPTED,
          tx,
        );
      } else {
        await friendRequestRepository.updateStatusById(
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
    const friendRequests = await friendRequestRepository.findReceivedPending({
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
    const friendRequests = await friendRequestRepository.findSentPending({
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
}

export const friendService = new FriendService();
