import prisma from "@/config/prisma";
import { UserStatus } from "@prisma/client";

class UserManagementRepository {
  async findAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        status: true,
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
}

export const userManagementRepository = new UserManagementRepository();
