import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/database/prisma.service';
import type { UserRoleType } from "@prisma/client";

@Injectable()
export class RolePermissionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByRoleId(roleId: string) {
    return this.prismaService.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });
  }

  async assignPermission(roleId: string, permissionId: string) {
    return this.prismaService.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  }

  async findPermission(roles: UserRoleType[]) {
    return this.prismaService.rolePermission.findMany({
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
    return this.prismaService.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId,
      },
    });
  }
}
