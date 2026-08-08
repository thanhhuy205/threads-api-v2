import type { BanUserUnlimitedInput } from "@/modules/admin/user-management/interfaces/ban-unlimited.input";
import { buildOffsetPaginationResponse } from '@/common/helpers/offset-pagination.helper';
import { UserStatus } from "@prisma/client";
import type { GetAdminUsersInput } from "./interfaces/get-admin-users.input";
import { Injectable } from '@nestjs/common';
import { UserManagementRepository } from "./user-management.repository";

@Injectable()
export class UserManagementService {
  constructor(private readonly userManagementRepository: UserManagementRepository) {}

  async getAllUsers(input: GetAdminUsersInput) {
    const [users, totalUsers] = await Promise.all([
      this.userManagementRepository.findAllUsers(input),
      this.userManagementRepository.countAllUsers(),
    ]);

    const rows = users.map((user) => ({
      ...user,
      roles: user.userRoles.map((ur) => ur.role.name),
      isVerified: !!user.verifiedAt,
    }));

    return {
      rows,
      pagination: buildOffsetPaginationResponse(totalUsers, input.page, input.limit),
    };
  }

  async unbanUser(input: BanUserUnlimitedInput) {
    const user = await this.userManagementRepository.updateUserBanFields({
      userId: input.userId,
      status: UserStatus.ACTIVE,
    });

    return {
      user: this.mapModeratedUser(user),
      status: user.status,
      banType: null,
    };
  }

  async banUserUnlimited(input: BanUserUnlimitedInput) {
    const user = await this.userManagementRepository.updateUserBanFields({
      userId: input.userId,
      status: UserStatus.BANNED,
    });

    return {
      user: this.mapModeratedUser(user),
      status: user.status,
      banType: "UNLIMITED" as const,
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
