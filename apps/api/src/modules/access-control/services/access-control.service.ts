import type { PermissionCode } from '@/common/constants/permission.constant';
import { ForbiddenException } from '@/errors/error';
import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { PermissionScope } from '@prisma/client';

@Injectable()
export class AccessControlService {
  constructor(private readonly prisma: PrismaService) {}

  async hasPermission(
    userId: string,
    permissionCode: PermissionCode,
    scope: PermissionScope = PermissionScope.WORKSPACE,
  ): Promise<boolean> {
    const allowedScopes =
      scope === PermissionScope.GROUP
        ? [PermissionScope.WORKSPACE, PermissionScope.GROUP]
        : [PermissionScope.WORKSPACE];

    const permission = await this.prisma.positionPermission.findFirst({
      where: {
        scope: { in: allowedScopes },
        permission: { code: permissionCode },
        position: {
          in: (
            await this.prisma.userPosition.findMany({
              where: { userId },
              select: { position: true },
            })
          ).map(({ position }) => position),
        },
      },
      select: { id: true },
    });

    return permission !== null;
  }

  async assertPermission(
    userId: string,
    permissionCode: PermissionCode,
    scope: PermissionScope = PermissionScope.WORKSPACE,
  ): Promise<void> {
    if (!(await this.hasPermission(userId, permissionCode, scope))) {
      throw new ForbiddenException(
        `Missing permission ${permissionCode} in ${scope.toLowerCase()} scope`,
      );
    }
  }
}
