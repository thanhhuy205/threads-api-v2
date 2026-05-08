import { userRepository } from "@/modules/user/repository/user.repository";
import type { FollowActionDataDto } from "../dto/response/follow-action.response.dto";
import type { GetFollowersDataDto } from "../dto/response/followers.response.dto";

class UserService {
  async getFollower(userId: string): Promise<GetFollowersDataDto> {
    return {
      followers: [],
    };
  }

  async followUser(
    userId: string,
    targetUserId: string,
  ): Promise<FollowActionDataDto> {
    return {
      following: true,
    };
  }

  async unFollowUser(
    userId: string,
    targetUserId: string,
  ): Promise<FollowActionDataDto> {
    return {
      following: false,
    };
  }

  async findByUserId(userId: string) {
    return userRepository.findById(userId);
  }

  async findByUsername(username: string) {
    return userRepository.findByUsername(username);
  }
}

export const userService = new UserService();
