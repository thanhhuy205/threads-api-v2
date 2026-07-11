import { redisKey } from "@/constants/resolve-key/redis-key";
import { postSearchService } from "@/modules/post/service/post-search.service";
import { userRepository } from "@/modules/user/repository/user.repository";
import { redisService } from "@/providers/redis.provider";
import { Prisma } from "@prisma/client";
import type { UpdateProfileDto } from "../dto/request/update-profile.request.dto";
import { mapUserProfileForFE } from "../mapper/user.mapper";
import { followRepository } from "../repository/follow.repository";

type GetNetworkUsernamesInput = {
  query: string;
};

class UserService {
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

    if (payload.isPrivate !== undefined) {
      data.isPrivate = payload.isPrivate;
    }

    const user = await userRepository.updateProfile(userId, data);
    await redisService.del(redisKey.auth.me(userId));

    return {
      name: user.name,
      bio: user.bio,
      labelWebsite: user.labelWebsite,
      website: user.website,
      isPrivate: user.isPrivate,
    };
  }

  async getMyKarma(userId: string) {
    return {
      userId,
      balance: 320,
      transactions: [
        {
          delta: 20,
          reason: "QUEST_REWARD",
          circleId: null,
          createdAt: new Date().toISOString(),
        },
        {
          delta: -10,
          reason: "SACRIFICE",
          circleId: 1,
          createdAt: new Date(Date.now() - 60_000).toISOString(),
        },
      ],
      restriction: null,
    };
  }

  async getMyBadges(userId: string) {
    return {
      userId,
      badges: [
        {
          type: "SACRIFICE_HERO",
          circleId: 1,
          circleName: "Skeleton Circle",
          createdAt: new Date().toISOString(),
        },
      ],
    };
  }

  async getMyStatusProfile(userId: string) {
    const [user, followingCount, postCount] = await Promise.all([
      userRepository.findStatusProfileById(userId),
      followRepository.countActiveFollowing(userId),
      postSearchService.count(userId)
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
    return userRepository.findById(userId);
  }

  async findByUsernameNotRelationShip(username: string, tx: Prisma.TransactionClient) {
    const user = await userRepository.findByUsername(username, tx);
    if (!user) {
      return null;
    }

    return mapUserProfileForFE(user);
  }

  async findByUsername(username: string, userId?: string) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      return null;
    }

    if (!userId) {
      const postCount = await postSearchService.count(user.id);
      return mapUserProfileForFE({
        ...user,
        postsCount: postCount,
        postCount,
      });
    }

    const [requestUser, follower, postCount] = await Promise.all([
      userRepository.findUserRequestFriend(userId, user.id),
      userRepository.findUserFollowing(userId, user.id),
      postSearchService.count(user.id),
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
    return userRepository.findExistingIds(userIds);
  }

  async findUsersByUsernames(usernames: string[]) {
    const normalizedUsernames = [
      ...new Set(usernames.map((username) => username.trim()).filter(Boolean)),
    ];

    return userRepository.findByUsernames(normalizedUsernames);
  }

  async searchUsername({ query }: GetNetworkUsernamesInput) {
    return userRepository.searchUsername(query);
  }

  async findUserByEmail(email: string) {
    return userRepository.findByEmail(email);
  }

  async searchUsernameOneQuery({ query }: { query: string }) {
    return userRepository.searchUsernameOneQuery(query);
  }
}

export const userService = new UserService();
