import { NotFoundException } from "@/errors/error";
import { followRepository } from "@/modules/user/repository/follow.repository";
import { userRepository } from "@/modules/user/repository/user.repository";
import { buildCursorPagination, type PaginationResponse } from "@/shared/pagination/cursor-pagination";
import type { FollowActionDataDto } from "../dto/response/follow-action.response.dto";
import type { FollowerUserDto } from "../mapper/follower.mapper";

type GetFollowersInput = {
  userId: string;
  after?: string;
  take: number;
};

type GetFollowersResult = {
  followers: FollowerUserDto[];
  pagination: PaginationResponse<string | number | null>;
};

class UserService {
  async getFollower({ userId, after, take }: GetFollowersInput): Promise<GetFollowersResult> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const followerRows = await followRepository.findAll({
      after,
      take,
      where: {
        followingId: userId,
        isFollowing: true,
      },
      props: {
        followingId: userId
      }
    });

    const { rows, pagination } = buildCursorPagination({
      rows: followerRows,
      take,
      getAfter: (follower) => follower.id,
    });

    return {
      followers: rows,
      pagination,
    };
  }

  async follower(userId: string, targetUserId: string): Promise<FollowActionDataDto> {
    if (userId === targetUserId) {
      return {
        isFollowing: false,
      };
    }

    const existingFollow = await followRepository.findFollowRecord(userId, targetUserId);
    if (existingFollow && existingFollow.isFollowing) {
      await followRepository.updateStatusByFollowId(existingFollow.id, false)
      return {
        isFollowing: false
      }
    }
    else if (existingFollow && !existingFollow.isFollowing) {
      await followRepository.updateStatusByFollowId(existingFollow.id, true)
      return {
        isFollowing: true
      }
    }
    const follow = await followRepository.create(userId, targetUserId);
    return {
      isFollowing: follow.isFollowing,
    };
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
