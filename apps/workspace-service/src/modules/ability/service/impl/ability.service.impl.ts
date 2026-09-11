import type { PermissionCode } from '@libs/common/src/constants/permission.constant';
import { ForbiddenException } from '@/errors/error';
import { RedisService } from '@libs/core/src/redis/redis.service';
import { Inject, Injectable } from '@nestjs/common';
import { PermissionScope } from 'apps/workspace-service/generated/prisma';
import {
  ABILITY_REPOSITORY,
  type AbilityRepository,
} from '../../repository/ability.repository';
import type { AbilityService, AppAbility } from '../../ability.service';

const CACHE_TTL_SECONDS = 3600;

@Injectable()
export class AbilityServiceImpl implements AbilityService {
  constructor(
    @Inject(ABILITY_REPOSITORY)
    private readonly abilityRepository: AbilityRepository,
    private readonly redisService: RedisService,
  ) {}

  async createForUser(
    userId: string,
    scope: PermissionScope = PermissionScope.WORKSPACE,
  ): Promise<AppAbility> {
    const cacheKey = `ability:${userId}:${scope}`;
    const cachedPermissions = await this.redisService.redis.get(cacheKey);

    let permissionCodes: string[];
    if (cachedPermissions) {
      permissionCodes = JSON.parse(cachedPermissions) as string[];
    } else {
      const allowedScopes =
        scope === PermissionScope.GROUP
          ? [PermissionScope.WORKSPACE, PermissionScope.GROUP]
          : [PermissionScope.WORKSPACE];

      permissionCodes = await this.abilityRepository.findPermissionCodes(
        userId,
        allowedScopes,
      );
      await this.redisService.redis.setEx(
        cacheKey,
        CACHE_TTL_SECONDS,
        JSON.stringify(permissionCodes),
      );
    }

    const permissions = new Set(permissionCodes);
    return { can: (action) => permissions.has(action) };
  }

  async can(
    userId: string,
    permission: PermissionCode,
    scope: PermissionScope = PermissionScope.WORKSPACE,
  ): Promise<boolean> {
    return (await this.createForUser(userId, scope)).can(permission);
  }

  async assertCan(
    userId: string,
    permission: PermissionCode,
    scope: PermissionScope = PermissionScope.WORKSPACE,
  ): Promise<void> {
    if (!(await this.can(userId, permission, scope))) {
      throw new ForbiddenException(
        `Missing permission ${permission} in ${scope.toLowerCase()} scope`,
      );
    }
  }
}
