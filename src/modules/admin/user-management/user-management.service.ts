import { UserStatus } from "@prisma/client";
import type { BanUserInput } from "./interfaces/ban-user.input";
import type { GetAdminUsersInput } from "./interfaces/get-admin-users.input";
import { userManagementRepository } from "./user-management.repository";
import { buildPaginationResponse } from "@/shared/pagination/pagination";

class UserManagementService {
  async getAllUsers(input: GetAdminUsersInput) {
    const [users, totalUsers] = await Promise.all([
      userManagementRepository.findAllUsers(input),
      userManagementRepository.countAllUsers(),
    ]);

    const rows = users.map((user) => ({
      ...user,
      roles: user.userRoles.map((ur) => ur.role.name),
      isVerified: !!user.verifiedAt,
    }));

    return {
      rows,
      pagination: buildPaginationResponse(totalUsers, input.page, input.limit),
    };
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
