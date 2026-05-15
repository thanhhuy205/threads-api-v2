import { UserStatus } from "@prisma/client";
import type { BanUserInput } from "./interfaces/ban-user.input";
import { userManagementRepository } from "./user-management.repository";

class UserManagementService {
  async getAllUsers() {
    const users = await userManagementRepository.findAllUsers();
    return users.map((user) => ({
      ...user,
      roles: user.userRoles.map((ur) => ur.role.name),
      isVerified: !!user.verifiedAt,
    }));
  }

  async banUser(input: BanUserInput) {
    // TODO: finalize temporary-ban business rules here before calling repo.
    return userManagementRepository.updateUserBanFields({
      userId: input.userId,
      status: UserStatus.BANNED,
      bannedUntil: input.bannedUntil,
    });
  }
}

export const userManagementService = new UserManagementService();
