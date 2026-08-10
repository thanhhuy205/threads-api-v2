import { redisKey } from "@/constants/resolve-key/redis-key";
import { PostSearchService } from "@/modules/post/service/post-search.service";
import { UserRepository } from "@/modules/user/repository/user.repository";
import { redisService } from "@/providers/redis.provider";
import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
    @Inject(forwardRef(() => PostSearchService)) private readonly postSearchService: PostSearchService,
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
    await redisService.del(redisKey.auth.me(userId));

    return {
      name: user.name,
      bio: user.bio,
      labelWebsite: user.labelWebsite,
      website: user.website,
    };
  }

  async getMyStatusProfile(userId: string) {
    const [user, followingCount, postCount] = await Promise.all([
      this.userRepository.findStatusProfileById(userId),
      this.followRepository.countActiveFollowing(userId),
      this.postSearchService.count(userId)
    ]);

    if (!user) {
      return null;
    }

    return {
      isSuccessFollow: followingCount >= 10,
      isSuccessBio: user.bio !== null,
      isSuccessPost: postCount >= 1,
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
      const postCount = await this.postSearchService.count(user.id);
      return mapUserProfileForFE({
        ...user,
        postsCount: postCount,
        postCount,
      });
    }

    const [requestUser, follower, postCount] = await Promise.all([
      this.userRepository.findUserRequestFriend(userId, user.id),
      this.userRepository.findUserFollowing(userId, user.id),
      this.postSearchService.count(user.id),
    ]);

    return mapUserProfileForFE({
      ...user,
      ...requestUser,
      ...follower,
      postsCount: postCount,
      postCount,
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

