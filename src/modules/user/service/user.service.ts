import { postService } from "@/modules/post/service/post.service";
import { userRepository } from "@/modules/user/repository/user.repository";
import { Prisma } from "@prisma/client";
import { mapUserProfileForFE } from "../mapper/user.mapper";
import { followRepository } from "../repository/follow.repository";

type GetNetworkUsernamesInput = {
  query: string;
};

class UserService {
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
      postService.count(userId)
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
      const postCount = await postService.count(user.id);
      return mapUserProfileForFE({
        ...user,
        postsCount: postCount,
        postCount,
      });
    }

    const [requestUser, follower, postCount] = await Promise.all([
      userRepository.findUserRequestFriend(userId, user.id),
      userRepository.findUserFollowing(userId, user.id),
      postService.count(user.id),
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
