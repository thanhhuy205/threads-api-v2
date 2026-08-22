import { PERMISSIONS, type PermissionCode } from '@/common/constants/permission.constant';
import { ForbiddenException } from '@/errors/error';
import type { AbilityRepository } from '@/modules/ability/repository/ability.repository';
import { AbilityServiceImpl } from '@/modules/ability/service/impl/ability.service.impl';
import { ExpirationPolicy } from '@/modules/post/policies/expiration.policy';
import { PinPolicy } from '@/modules/post/policies/pin.policy';
import { PermissionScope, Position, VisibilityPost } from '@prisma/client';

jest.mock('@nestjs/common', () => ({
  BadRequestException: class BadRequestException extends Error {},
  Inject: () => () => undefined,
  Injectable: () => <T>(target: T) => target,
}));

type UserFixture = {
  id: string;
  position: Position;
};

const users = {
  ceo: { id: 'user-ceo', position: Position.CEO },
  hr: { id: 'user-hr', position: Position.HR },
  techLead: { id: 'user-tech-lead', position: Position.TECH_LEAD },
  developer: { id: 'user-developer', position: Position.SOFTWARE_ENGINEER },
  employee: { id: 'user-employee', position: Position.OTHER },
} satisfies Record<string, UserFixture>;

const positionPermissions: Partial<
  Record<Position, Array<{ code: PermissionCode; scope: PermissionScope }>>
> = {
  [Position.CEO]: [
    { code: PERMISSIONS.POST_CREATE, scope: PermissionScope.WORKSPACE },
    { code: PERMISSIONS.POST_PIN, scope: PermissionScope.WORKSPACE },
    { code: PERMISSIONS.POST_EXPIRE, scope: PermissionScope.WORKSPACE },
    { code: PERMISSIONS.ANNOUNCEMENT_CREATE, scope: PermissionScope.WORKSPACE },
  ],
  [Position.HR]: [
    { code: PERMISSIONS.POST_CREATE, scope: PermissionScope.WORKSPACE },
    { code: PERMISSIONS.POST_PIN, scope: PermissionScope.WORKSPACE },
    { code: PERMISSIONS.POST_EXPIRE, scope: PermissionScope.WORKSPACE },
    { code: PERMISSIONS.ANNOUNCEMENT_CREATE, scope: PermissionScope.WORKSPACE },
  ],
  [Position.TECH_LEAD]: [
    { code: PERMISSIONS.GROUP_CREATE, scope: PermissionScope.WORKSPACE },
    { code: PERMISSIONS.POST_CREATE, scope: PermissionScope.GROUP },
  ],
  [Position.SOFTWARE_ENGINEER]: [
    { code: PERMISSIONS.POST_CREATE, scope: PermissionScope.GROUP },
  ],
  [Position.OTHER]: [
    { code: PERMISSIONS.POST_CREATE, scope: PermissionScope.GROUP },
  ],
};

describe('position-based abilities', () => {
  let abilityService: AbilityServiceImpl;
  let repository: jest.Mocked<AbilityRepository>;
  let cache: Map<string, string>;

  beforeEach(() => {
    cache = new Map<string, string>();
    repository = {
      findPermissionCodes: jest.fn(async (userId, scopes) => {
        const user = Object.values(users).find(({ id }) => id === userId);
        if (!user) return [];

        return (positionPermissions[user.position] ?? [])
          .filter(({ scope }) => scopes.includes(scope))
          .map(({ code }) => code);
      }),
    };

    const redisService = {
      redis: {
        get: jest.fn(async (key: string) => cache.get(key) ?? null),
        setEx: jest.fn(async (key: string, _ttl: number, value: string) => {
          cache.set(key, value);
          return 'OK';
        }),
      },
    };

    abilityService = new AbilityServiceImpl(repository, redisService as never);
  });

  it.each([users.ceo, users.hr])(
    '$position can create, schedule/date-range, and pin workspace posts',
    async (user) => {
      await expect(
        abilityService.assertCan(user.id, PERMISSIONS.POST_CREATE),
      ).resolves.toBeUndefined();
      await expect(
        abilityService.assertCan(user.id, PERMISSIONS.POST_EXPIRE),
      ).resolves.toBeUndefined();
      await expect(
        abilityService.assertCan(user.id, PERMISSIONS.POST_PIN),
      ).resolves.toBeUndefined();
    },
  );

  it('allows only Tech Lead to create and manage a team', async () => {
    await expect(
      abilityService.assertCan(users.techLead.id, PERMISSIONS.GROUP_CREATE),
    ).resolves.toBeUndefined();

    await expect(
      abilityService.assertCan(users.developer.id, PERMISSIONS.GROUP_CREATE),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await expect(
      abilityService.assertCan(users.ceo.id, PERMISSIONS.GROUP_CREATE),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it.each([users.techLead, users.developer, users.employee])(
    '$position can post in a group but not in the workspace',
    async (user) => {
      await expect(
        abilityService.assertCan(
          user.id,
          PERMISSIONS.POST_CREATE,
          PermissionScope.GROUP,
        ),
      ).resolves.toBeUndefined();

      await expect(
        abilityService.assertCan(
          user.id,
          PERMISSIONS.POST_CREATE,
          PermissionScope.WORKSPACE,
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
    },
  );

  it.each([users.techLead, users.developer, users.employee])(
    'rejects schedule/date-range and pin fields for $position',
    async (user) => {
      const expirationPolicy = new ExpirationPolicy(abilityService);
      const pinPolicy = new PinPolicy(abilityService);
      const basePayload = {
        userId: user.id,
        content: 'Group update',
        isSurvey: false,
        visibility: VisibilityPost.GROUP,
      };

      await expect(
        expirationPolicy.enforce(
          { ...basePayload, scheduledTimeFrom: '09:00' },
          { scope: PermissionScope.GROUP },
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
      await expect(
        pinPolicy.enforce(
          { ...basePayload, isPinned: true },
          { scope: PermissionScope.GROUP },
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
    },
  );

  it('rebuilds a working ability from cached permission codes', async () => {
    await abilityService.createForUser(users.ceo.id);
    const cachedAbility = await abilityService.createForUser(users.ceo.id);

    expect(cachedAbility.can(PERMISSIONS.POST_PIN, 'all')).toBe(true);
    expect(repository.findPermissionCodes).toHaveBeenCalledTimes(1);
  });
});
