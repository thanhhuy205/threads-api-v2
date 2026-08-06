import { NotFoundException } from "@/errors/error";
import { FollowRepository, followRepository as legacyFollowRepository } from "@/modules/user/repository/follow.repository";
import { UserRepository, userRepository as legacyUserRepository } from "@/modules/user/repository/user.repository";
import {
  buildCursorPagination,
  type PaginationResponse,
} from "@/shared/pagination/cursor-pagination";
import { Injectable } from '@nestjs/common';
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

@Injectable()
export class FollowerService {
  constructor(
    private readonly followRepository: FollowRepository = legacyFollowRepository,
    private readonly userRepository: UserRepository = legacyUserRepository,
  ) { }

  async getFollower({
    userId,
    after,
    take,
  }: GetFollowersInput): Promise<GetUsersPaginationResult> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const followerRows = await this.followRepository.findFollowers({
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
    const followingPosts = await this.followRepository.findUserFollowingPostByAuth(userId, authorIds);
    return followingPosts;
  }

  async getUserFollowersByAuth(userId: string, authorIds: string[]) {
    const followers = await this.followRepository.findUserFollowersByAuth(userId, authorIds);
    return followers;
  }

  async getFollowing({
    userId,
    after,
    take,
  }: GetFollowersInput): Promise<GetUsersPaginationResult> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const followingRows = await this.followRepository.findFollowing({
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

    const existingFollow = await this.followRepository.findFollowRecord(
      userId,
      targetUserId,
    );
    if (existingFollow && existingFollow.isFollowing) {
      await this.followRepository.updateStatusByFollowId(existingFollow.id, false);
      await this.userRepository.decrementFollowersCount(targetUserId);
      return {
        isFollowing: false,
      };
    } else if (existingFollow && !existingFollow.isFollowing) {
      await this.followRepository.updateStatusByFollowId(existingFollow.id, true);
      await this.userRepository.incrementFollowersCount(targetUserId);
      return {
        isFollowing: true,
      };
    }
    const follow = await this.followRepository.create(userId, targetUserId);
    await this.userRepository.incrementFollowersCount(targetUserId);
    return {
      isFollowing: follow.isFollowing,
    };
  }
}

export const followerService = new FollowerService();
