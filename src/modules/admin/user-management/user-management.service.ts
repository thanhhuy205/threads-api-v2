import { UserStatus } from "@prisma/client";
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

  async banUser(userId: string) {
    return userManagementRepository.updateUserStatus(userId, UserStatus.BANNED);
  }
}

export const userManagementService = new UserManagementService();
