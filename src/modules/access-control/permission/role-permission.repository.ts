import prisma from "@/config/prisma";
import type { Prisma } from "@prisma/client";

class RolePermissionRepository {
  async findByRoleId(roleId: string) {
    return prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });
  }

  async assignPermission(roleId: string, permissionId: string) {
    return prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  }

  async removePermission(roleId: string, permissionId: string) {
    return prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId,
      },
    });
  }
}

export const rolePermissionRepository = new RolePermissionRepository();
