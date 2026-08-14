import type { PermissionCode } from '@/common/constants/permission.constant';
import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import type { PermissionScope } from '@prisma/client';

@Injectable()
export class UserPositionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async hasPermission(
    userId: string,
    permissionCode: PermissionCode,
    allowedScopes: PermissionScope[],
  ): Promise<boolean> {
    const userPosition = await this.prismaService.userPosition.findFirst({
      where: {
        userId,
        positionPermission: {
          scope: { in: allowedScopes },
          permission: { code: permissionCode },
        },
      },
      select: { id: true },
    });

    return userPosition !== null;
  }
}
