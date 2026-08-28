import { redisKey } from "@libs/core/constants/redis-key";
import { RedisService } from "@libs/core/src/redis/redis.service";
import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, type UserRepository } from "@user-service/modules/user/repository/user.repository";
import { Prisma } from 'apps/user-service/generated/prisma';
import type { UpdateProfileDto } from "../../dto/request/update-profile.request.dto";
import { mapUserProfileForFE } from "../../mapper/user.mapper";
import type { UserService } from '../user.service';

type GetNetworkUsernamesInput = {
  query: string;
};

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
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
  async getPermissionPositionByUserId(userId: string) {
    return await this.userRepository.getPermissionPositionByUserId(userId);
  }
  async getMyStatusProfile(userId: string) {
    const user = await this.userRepository.findStatusProfileById(userId);

    if (!user) {
      return null;
    }

    return {
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

    return mapUserProfileForFE(user);
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

