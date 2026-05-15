import prisma from "@/config/prisma";
import { UserStatus } from "@prisma/client";
import type { UpdateExpiredBannedUsersInput } from "./interfaces/update-expired-banned-users.input";

class UserManagementRepository {
  /**
   * DB read for admin user listing.
   * Includes bannedUntil so admin screens can show temporary-ban expiry.
   */
  async findAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        status: true,
        bannedUntil: true,
        verifiedAt: true,
        createdAt: true,
        userRoles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    return prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  }

  /**
   * DB write for ban-related columns only.
   * No business decision lives here; service decides status and bannedUntil.
   */
  async updateUserBanFields(input: {
    userId: string;
    status: UserStatus;
    bannedUntil?: Date | null;
  }) {
    return prisma.user.update({
      where: { id: input.userId },
      data: {
        status: input.status,
        bannedUntil: input.bannedUntil,
      },
    });
  }

  /**
   * DB bulk update for users whose temporary ban expired before input.now.
   * Worker/service supplies the target status and clear value.
   */
  async updateExpiredBannedUsers(input: UpdateExpiredBannedUsersInput) {
    return prisma.user.updateMany({
      where: {
        status: UserStatus.BANNED,
        bannedUntil: {
          lt: input.now,
        },
      },
      data: {
        status: input.status,
        bannedUntil: input.bannedUntil,
      },
    });
  }
}

export const userManagementRepository = new UserManagementRepository();
