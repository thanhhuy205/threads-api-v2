import { userRepository } from "@/modules/user/repository/user.repository";
import type { FollowActionDataDto } from "../dto/response/follow-action.response.dto";
import type { GetFollowersDataDto } from "../dto/response/followers.response.dto";

class UserService {
  async getFollower(userId: string): Promise<GetFollowersDataDto> {
    return {
      followers: [],
    };
  }

  async follower(userId: string, targetUserId: string): Promise<FollowActionDataDto> {
    if (userId === targetUserId) {
      return {
        isFollowing: false,
      };
    }

    const existingFollow = await userRepository.findFollowRecord(userId, targetUserId);
    if (existingFollow && existingFollow.isFollowing) {
      await userRepository.updateStatusByFollowId(existingFollow.id, false)
      return {
        isFollowing: false
      }
    }
    else if (existingFollow && !existingFollow.isFollowing) {
      await userRepository.updateStatusByFollowId(existingFollow.id, true)
      return {
        isFollowing: true
      }
    }
    const follow = await userRepository.create(userId, targetUserId);
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
