import { baseLogger } from "@/middlewares/logger";
import { userRepository } from "@/modules/user/repository/user.repository";
import {
  buildCursorPagination,
  type PaginationResponse,
} from "@/shared/pagination/cursor-pagination";
import { Prisma } from "@prisma/client";
import { mapUserProfileForFE } from "../mapper/user.mapper";
import type { UserUsernameItem } from "../repository/user.repository";

type GetNetworkUsernamesInput = {
  userId: string;
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
    userId,
    query,
    after,
    take,
  }: GetNetworkUsernamesInput): Promise<GetNetworkUsernamesResult> {
    baseLogger.info(`Getting network usernames for user ${userId} with query "${query}", after "${after}", take ${take}`
    );
    const usernames = await userRepository.findNetworkUsernames({
      userId,
      query: query.toLowerCase().trim(),
      after,
      take,
    });

    return buildCursorPagination({
      rows: usernames,
      take,
      getAfter: (item) => item.username,
    });
  }
}

export const userService = new UserService();
