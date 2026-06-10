import type { BanUserUnlimitedInput } from "@/modules/admin/user-management/interfaces/ban-unlimited.input";
import { buildPaginationResponse } from "@/shared/pagination/pagination";
import { UserStatus } from "@prisma/client";
import type { BanUserInput } from "./interfaces/ban-user.input";
import type { GetAdminUsersInput } from "./interfaces/get-admin-users.input";
import { userManagementRepository } from "./user-management.repository";

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
    const bannedUntil = new Date(
      Date.now() + input.durationHours * 60 * 60 * 1000,
    );

    const user = await userManagementRepository.updateUserBanFields({
      userId: input.userId,
      status: UserStatus.BANNED,
      bannedUntil,
    });

    return {
      user: this.mapModeratedUser(user),
      status: user.status,
      banType: "LIMITED" as const,
      durationHours: input.durationHours,
      bannedUntil: user.bannedUntil,
    };
  }

  async unbanUser(input: BanUserUnlimitedInput) {
    const user = await userManagementRepository.updateUserBanFields({
      userId: input.userId,
      status: UserStatus.ACTIVE,
      bannedUntil: null,
    });

    return {
      user: this.mapModeratedUser(user),
      status: user.status,
      banType: null,
      durationHours: null,
      bannedUntil: user.bannedUntil,
    };
  }

  async banUserUnlimited(input: BanUserUnlimitedInput) {
    const user = await userManagementRepository.updateUserBanFields({
      userId: input.userId,
      status: UserStatus.BANNED,
      bannedUntil: null,
    });

    return {
      user: this.mapModeratedUser(user),
      status: user.status,
      banType: "UNLIMITED" as const,
      durationHours: null,
      bannedUntil: user.bannedUntil,
    };
  }

  private mapModeratedUser(user: {
    id: string;
    name: string | null;
    email: string;
    username: string;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    };
  }
}
export const userManagementService = new UserManagementService();
