import { NotFoundException } from "@/errors/error";
import { followRepository } from "@/modules/user/repository/follow.repository";
import { userRepository } from "@/modules/user/repository/user.repository";
import { friendRequestRepository } from "../repository/friend-request.repository";
import {
  buildCursorPagination,
  type PaginationResponse,
} from "@/shared/pagination/cursor-pagination";
import type { FollowActionDataDto } from "../dto/response/follow-action.response.dto";
import type { FollowerUserDto } from "../mapper/follower.mapper";
import { FriendRequestStatus } from "@prisma/client";
import { USER_MESSAGE } from "@/constants/message";

type GetFollowersInput = {
  userId: string;
  after?: string;
  take: number;
};

type GetUsersPaginationResult = {
  users: FollowerUserDto[];
  pagination: PaginationResponse<string | number | null>;
};

type FriendRequestResponse = {
  sendFriends: boolean;
};

class UserService {
  async getFollower({
    userId,
    after,
    take,
  }: GetFollowersInput): Promise<GetUsersPaginationResult> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const followerRows = await followRepository.findFollowers({
      after,
      take,
      where: {
        followingId: userId,
        isFollowing: true,
      },
      props: {
        followingId: userId,
      },
    });

    const { rows, pagination } = buildCursorPagination({
      rows: followerRows,
      take,
      getAfter: (follower) => follower.id,
    });

    return {
      users: rows,
      pagination,
    };
  }

  async getFollowing({
    userId,
    after,
    take,
  }: GetFollowersInput): Promise<GetUsersPaginationResult> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const followingRows = await followRepository.findFollowing({
      after,
      take,
      where: {
        userId,
        isFollowing: true,
      },
      props: {
        userId,
      },
    });

    const { rows, pagination } = buildCursorPagination({
      rows: followingRows,
      take,
      getAfter: (following) => following.id,
    });

    return {
      users: rows,
      pagination,
    };
  }

  async follower(
    userId: string,
    targetUserId: string,
  ): Promise<FollowActionDataDto> {
    if (userId === targetUserId) {
      return {
        isFollowing: false,
      };
    }

    const existingFollow = await followRepository.findFollowRecord(
      userId,
      targetUserId,
    );
    if (existingFollow && existingFollow.isFollowing) {
      await followRepository.updateStatusByFollowId(existingFollow.id, false);
      await userRepository.decrementFollowersCount(targetUserId);
      return {
        isFollowing: false,
      };
    } else if (existingFollow && !existingFollow.isFollowing) {
      await followRepository.updateStatusByFollowId(existingFollow.id, true);
      await userRepository.incrementFollowersCount(targetUserId);
      return {
        isFollowing: true,
      };
    }
    const follow = await followRepository.create(userId, targetUserId);
    await userRepository.incrementFollowersCount(targetUserId);
    return {
      isFollowing: follow.isFollowing,
    };
  }

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

    await friendRequestRepository.create(userId, targetUser.id);
    return { sendFriends: true };
  }

  async handleFriendRequest(
    userId: string,
    requestId: number,
    isAccept: boolean,
  ) {
    const friendRequest = await friendRequestRepository.findById(requestId);
    if (!friendRequest) {
      throw new NotFoundException(USER_MESSAGE.FRIEND_REQUEST_NOT_FOUND);
    }
    if (friendRequest.receiverId !== userId) {
      throw new NotFoundException(USER_MESSAGE.FRIEND_REQUEST_NOT_FOUND);
    }

    if (isAccept) {
      await friendRequestRepository.updateStatusById(
        requestId,
        FriendRequestStatus.ACCEPTED,
      );
    } else {
      await friendRequestRepository.updateStatusById(
        requestId,
        FriendRequestStatus.REJECTED,
      );
    }
  }

  async getReceivedFriendRequests({
    senderId,
    receiverId,
    take,
  }: {
    senderId?: string;
    receiverId: string;
    take: number;
  }) {
    const friendRequests = await friendRequestRepository.findReceivedPending({
      receiverId,
      cursor: senderId ? { senderId } : undefined,
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
    after,
    take,
  }: {
    senderId: string;
    after?: string;
    take: number;
  }) {
    const friendRequests = await friendRequestRepository.findSentPending({
      senderId,
      cursor: after ? { receiverId: after } : undefined,
      take,
    });

    return buildCursorPagination({
      rows: friendRequests,
      take,
      getAfter: (fr) => fr.receiverId,
    });
  }

  async findByUserId(userId: string) {
    return userRepository.findById(userId);
  }

  async findByUsername(username: string) {
    return userRepository.findByUsername(username);
  }

  async findExistingIds(userIds: string[]) {
    return userRepository.findExistingIds(userIds);
  }
}

export const userService = new UserService();
