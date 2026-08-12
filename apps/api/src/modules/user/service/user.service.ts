import { redisKey } from "@/constants/resolve-key/redis-key";
import { UserRepository } from "@/modules/user/repository/user.repository";
import { RedisService } from "@libs/cache/redis.service";
import { Injectable } from '@nestjs/common';
import { Prisma } from "@prisma/client";
import type { UpdateProfileDto } from "../dto/request/update-profile.request.dto";
import { mapUserProfileForFE } from "../mapper/user.mapper";
import { FollowRepository } from "../repository/follow.repository";

type GetNetworkUsernamesInput = {
  query: string;
};

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
    private readonly redisService: RedisService,
  ) { }

  async updateProfile(userId: string, payload: UpdateProfileDto) {
    const data: Prisma.UserUpdateInput = {};

    if (payload.name !== undefined) {
      data.name = payload.name;
    }

    if (payload.bio !== undefined) {
      data.bio = payload.bio;
    }

    if (payload.labelWebsite !== undefined) {
      data.labelWebsite = payload.labelWebsite;
    }

    if (payload.website !== undefined) {
      data.website = payload.website;
    }

    const user = await this.userRepository.updateProfile(userId, data);
    await this.redisService.redis.del(redisKey.auth.me(userId));

    return {
      name: user.name,
      bio: user.bio,
      labelWebsite: user.labelWebsite,
      website: user.website,
    };
  }

  async getMyStatusProfile(userId: string) {
    const [user, followingCount] = await Promise.all([
      this.userRepository.findStatusProfileById(userId),
      this.followRepository.countActiveFollowing(userId),
    ]);

    if (!user) {
      return null;
    }

    return {
      isSuccessFollow: followingCount >= 10,
      isSuccessBio: user.bio !== null,
      isSuccessAvatar: user.avatar !== null && user.avatar !== "",
    };
  }

  async findByUserId(userId: string) {
    return this.userRepository.findById(userId);
  }

  async findByUsernameNotRelationShip(username: string, tx: Prisma.TransactionClient) {
    const user = await this.userRepository.findByUsername(username, tx);
    if (!user) {
      return null;
    }

    return mapUserProfileForFE(user);
  }

  async findByUsername(username: string, userId?: string) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      return null;
    }

    if (!userId) {
      return mapUserProfileForFE({
        ...user,
      });
    }

    const [requestUser, follower] = await Promise.all([
      this.userRepository.findUserRequestFriend(userId, user.id),
      this.userRepository.findUserFollowing(userId, user.id),
    ]);

    return mapUserProfileForFE({
      ...user,
      ...requestUser,
      ...follower,
    });
  }

  async findExistingIds(userIds: string[]) {
    return this.userRepository.findExistingIds(userIds);
  }

  async findUsersByUsernames(usernames: string[]) {
    const normalizedUsernames = [
      ...new Set(usernames.map((username) => username.trim()).filter(Boolean)),
    ];

    return this.userRepository.findByUsernames(normalizedUsernames);
  }

  async searchUsername({ query }: GetNetworkUsernamesInput) {
    return this.userRepository.searchUsername(query);
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async searchUsernameOneQuery({ query }: { query: string }) {
    return this.userRepository.searchUsernameOneQuery(query);
  }
}

