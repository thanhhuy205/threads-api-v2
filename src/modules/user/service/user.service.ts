import { userRepository } from "@/modules/user/repository/user.repository";
import { Prisma } from "@prisma/client";
import { mapUserProfileForFE } from "../mapper/user.mapper";

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
}

export const userService = new UserService();
