import type { PermissionCode } from '@/common/constants/permission.constant';
import { ForbiddenException } from '@/errors/error';
import { Injectable } from '@nestjs/common';
import { PermissionScope } from '@prisma/client';
import { UserPositionRepository } from '../position/repository/user-position.repository';

@Injectable()
export class AccessControlService {
  constructor(
    private readonly userPositionRepository: UserPositionRepository,
  ) { }

  async hasPermission(
    userId: string,
    permissionCode: PermissionCode,
    scope: PermissionScope = PermissionScope.WORKSPACE,
  ): Promise<boolean> {
    const allowedScopes =
      scope === PermissionScope.GROUP
        ? [PermissionScope.WORKSPACE, PermissionScope.GROUP]
        : [PermissionScope.WORKSPACE];

    return this.userPositionRepository.hasPermission(
      userId,
      permissionCode,
      allowedScopes,
    );
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
