import { userRepository } from "@/modules/user/repository/user.repository";
import { Prisma } from "@prisma/client";
import {
  buildCursorPagination,
  type PaginationResponse,
} from "@/shared/pagination/cursor-pagination";
import { mapUserProfileForFE } from "../mapper/user.mapper";
import type { UserUsernameItem } from "../repository/user.repository";

type GetNetworkUsernamesInput = {
  userId: string;
  after?: string;
  take: number;
};

type GetNetworkUsernamesResult = {
  rows: UserUsernameItem[];
  pagination: PaginationResponse<string | number | null>;
};

class UserService {
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
    after,
    take,
  }: GetNetworkUsernamesInput): Promise<GetNetworkUsernamesResult> {
    const usernames = await userRepository.findNetworkUsernames({
      userId,
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
