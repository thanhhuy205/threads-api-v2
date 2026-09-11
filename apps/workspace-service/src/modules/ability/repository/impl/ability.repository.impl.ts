import { Injectable } from '@nestjs/common';
import { PrismaService } from '@workspace-service/prisma/prisma.service';
import type { PermissionScope } from 'apps/workspace-service/generated/prisma';
import type { AbilityRepository } from '../ability.repository';

@Injectable()
export class AbilityRepositoryImpl implements AbilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPermissionCodes(userId: string, scopes: PermissionScope[]) {
    const positions = await this.prisma.userPosition.findMany({
      where: {
        userId,
        positionPermission: { scope: { in: scopes } },
      },
      select: {
        positionPermission: {
          select: { permission: { select: { code: true } } },
        },
      },
    });

    return positions.map(
      ({ positionPermission }) => positionPermission.permission.code,
    );
  }
}
