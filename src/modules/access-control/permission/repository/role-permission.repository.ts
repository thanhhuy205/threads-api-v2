import prisma from "@/config/prisma";
import type { UserRoleType } from "@prisma/client";

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

  async findPermission(roles: UserRoleType[]) {
    return prisma.rolePermission.findMany({
      where: {
        role: {
          name: {
            in: roles,
          },
        },
      },
      select: {
        permission: {
          select: {
            code: true,
            name: true,
          },
        },
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
