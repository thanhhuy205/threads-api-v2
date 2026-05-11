import prisma from "@/config/prisma";
import type { Prisma } from "@prisma/client";

class UserRoleRepository {
  async findByUserId(userId: string) {
    return prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
  }

  async assignRole(userId: string, roleId: string) {
    return prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async removeRole(userId: string, roleId: string) {
    return prisma.userRole.deleteMany({
      where: {
        userId,
        roleId,
      },
    });
  }
}

export const userRoleRepository = new UserRoleRepository();
