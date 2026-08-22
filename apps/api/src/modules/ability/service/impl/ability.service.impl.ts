import type { PermissionCode } from '@/common/constants/permission.constant';
import { ForbiddenException } from '@/errors/error';
import type { RedisService } from '@libs/cache/redis.service';
import { Inject, Injectable } from '@nestjs/common';
import { PermissionScope } from '@prisma/client';
import {
  ABILITY_REPOSITORY,
  type AbilityRepository,
} from '../../repository/ability.repository';
import type { AbilityService, AppAbility } from '../ability.service';

type AbilityRule = {
  action: PermissionCode;
  subject: 'all';
};

const { createPrismaAbility } = require('@casl/prisma') as {
  createPrismaAbility(rules?: AbilityRule[]): AppAbility;
};

@Injectable()
export class AbilityServiceImpl implements AbilityService {
  constructor(
    @Inject(ABILITY_REPOSITORY)
    private readonly abilityRepository: AbilityRepository,

    private readonly redisService: RedisService,
  ) { }

  async createForUser(
    userId: string,
    scope: PermissionScope = PermissionScope.WORKSPACE,
  ): Promise<AppAbility> {

    const cachedAbility = await this.redisService.redis.get(`ability:${userId}:${scope}`);
    if (cachedAbility) {
      const cachedPermissionCodes = JSON.parse(cachedAbility) as unknown;
      if (Array.isArray(cachedPermissionCodes)) {
        return createPrismaAbility(
          (cachedPermissionCodes as PermissionCode[]).map((permissionCode) => ({
            action: permissionCode,
            subject: 'all' as const,
          })),
        );
      }
    }

    const allowedScopes =
      scope === PermissionScope.GROUP
        ? [PermissionScope.WORKSPACE, PermissionScope.GROUP]
        : [PermissionScope.WORKSPACE];

    const permissionCodes = await this.abilityRepository.findPermissionCodes(
      userId,
      allowedScopes,
    );

    const rules = permissionCodes.map((permissionCode) => ({
      action: permissionCode as PermissionCode,
      subject: 'all' as const,
    }));


    const result = createPrismaAbility(rules);

    await this.redisService.redis.setEx(
      `ability:${userId}:${scope}`,
      3600,
      JSON.stringify(permissionCodes),
    );

    return result;
  }

  async can(
    userId: string,
    permission: PermissionCode,
    scope: PermissionScope = PermissionScope.WORKSPACE,
  ) {
    return (await this.createForUser(userId, scope)).can(permission, 'all');
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
