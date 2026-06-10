import { baseLogger } from "@/middlewares/logger";
import { searchService } from "@/modules/search/service/search.service";
import { userRepository } from "@/modules/user/repository/user.repository";
import {
  type PaginationResponse
} from "@/shared/pagination/cursor-pagination";
import { Prisma } from "@prisma/client";
import { mapUserProfileForFE } from "../mapper/user.mapper";
import type { UserUsernameItem } from "../repository/user.repository";

type GetNetworkUsernamesInput = {
  query: string;
  after?: string;
  take: number;
};

type GetNetworkUsernamesResult = {
  rows: UserUsernameItem[];
  pagination: PaginationResponse<string | number | null>;
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
      return mapUserProfileForFE(user);
    }

    const [requestUser, follower] = await Promise.all([
      userRepository.findUserRequestFriend(userId, user.id),
      userRepository.findUserFollowing(userId, user.id),
    ]);

    return mapUserProfileForFE({
      ...user,
      ...requestUser,
      ...follower,
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

  async getNetworkUsernames({
    query,
    after,
    take,
  }: GetNetworkUsernamesInput): Promise<GetNetworkUsernamesResult> {
    baseLogger.info(`Getting network usernames for with query "${query}", after "${after}", take ${take}`
    );
    const result = await searchService.searchUsername({ q: query, after, take });
    return result;
  }

  async findUserByEmail(email: string) {
    return userRepository.findByEmail(email);
  }
}

export const userService = new UserService();
