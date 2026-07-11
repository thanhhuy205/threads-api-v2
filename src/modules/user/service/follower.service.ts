import { NotFoundException } from "@/errors/error";
import { userActionLogService } from "@/modules/user-action-log/service/user-action-log.service";
import { followRepository } from "@/modules/user/repository/follow.repository";
import { userRepository } from "@/modules/user/repository/user.repository";
import {
  buildCursorPagination,
  type PaginationResponse,
} from "@/shared/pagination/cursor-pagination";
import type { FollowActionDataDto } from "../dto/response/follow-action.response.dto";
import type { FollowerUserDto } from "../mapper/follower.mapper";

type GetFollowersInput = {
  userId: string;
  after?: string;
  take: number;
};

type GetUsersPaginationResult = {
  users: FollowerUserDto[];
  pagination: PaginationResponse<string | number | null>;
};

class FollowerService {
  private async logFollowCreated(userId: string, targetUserId: string) {
    await Promise.all([
      userActionLogService.logFollowingCreated({
        userId,
        targetId: targetUserId,
        metadata: {
          targetUserId,
        },
      }),
      userActionLogService.logFollowerCreated({
        userId: targetUserId,
        targetId: userId,
        metadata: {
          followerId: userId,
        },
      }),
    ]);
  }

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


  async getUserFollowingPostByAuth(userId: string, authorIds: string[]) {
    const followingPosts = await followRepository.findUserFollowingPostByAuth(userId, authorIds);
    return followingPosts;
  }

  async getUserFollowersByAuth(userId: string, authorIds: string[]) {
    const followers = await followRepository.findUserFollowersByAuth(userId, authorIds);
    return followers;
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
      await this.logFollowCreated(userId, targetUserId);
      return {
        isFollowing: true,
      };
    }
    const follow = await followRepository.create(userId, targetUserId);
    await userRepository.incrementFollowersCount(targetUserId);
    await this.logFollowCreated(userId, targetUserId);
    return {
      isFollowing: follow.isFollowing,
    };
  }
}

export const followerService = new FollowerService();
