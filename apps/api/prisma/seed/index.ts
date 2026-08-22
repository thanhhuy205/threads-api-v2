import 'dotenv/config';

import { PERMISSIONS } from '@/common/constants/permission.constant';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import {
  PermissionScope,
  Position,
  PostType,
  PrismaClient,
  UserRoleType,
  UserStatus,
  VisibilityPost,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to run the database seed');
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(databaseUrl),
});

const SEED_PASSWORD = '12345678';
const SEED_AVATAR =
  'https://threads.file.huydarealest.com/thread-store/medias/fall_back/fall_back.jpg';

const employees = [
  {
    key: 'ceo',
    email: 'ceo@company.local',
    username: 'company_ceo',
    name: 'Nguyen Minh CEO',
    position: Position.CEO,
  },
  {
    key: 'hr',
    email: 'hr@company.local',
    username: 'company_hr',
    name: 'Tran Ha HR',
    position: Position.HR,
  },
  {
    key: 'cto',
    email: 'cto@company.local',
    username: 'company_cto',
    name: 'Le Quang CTO',
    position: Position.CTO,
  },
  {
    key: 'techLead',
    email: 'techlead@company.local',
    username: 'company_tech_lead',
    name: 'Pham Anh Tech Lead',
    position: Position.TECH_LEAD,
  },
  {
    key: 'seniorDeveloper',
    email: 'senior.dev@company.local',
    username: 'company_senior_dev',
    name: 'Vo Linh Senior Developer',
    position: Position.SENIOR_SOFTWARE_ENGINEER,
  },
  {
    key: 'developer',
    email: 'developer@company.local',
    username: 'company_developer',
    name: 'Do Nam Developer',
    position: Position.SOFTWARE_ENGINEER,
  },
  {
    key: 'internDeveloper',
    email: 'intern.dev@company.local',
    username: 'company_intern_dev',
    name: 'Bui An Intern Developer',
    position: Position.INTERN_SOFTWARE_ENGINEER,
  },
  {
    key: 'employee',
    email: 'employee@company.local',
    username: 'company_employee',
    name: 'Hoang My Employee',
    position: Position.OTHER,
  },
] as const;

const permissionDefinitions = [
  { code: PERMISSIONS.POST_CREATE, name: 'Create post' },
  { code: PERMISSIONS.POST_PIN, name: 'Pin post' },
  { code: PERMISSIONS.POST_EXPIRE, name: 'Set post expiration' },
  { code: PERMISSIONS.ANNOUNCEMENT_CREATE, name: 'Create announcement' },
  { code: PERMISSIONS.GROUP_CREATE, name: 'Create group' },
] as const;

const permissionMatrix = [
  ...[Position.CEO, Position.HR].flatMap((position) => [
    { position, code: PERMISSIONS.POST_CREATE, scope: PermissionScope.WORKSPACE },
    { position, code: PERMISSIONS.POST_PIN, scope: PermissionScope.WORKSPACE },
    { position, code: PERMISSIONS.POST_EXPIRE, scope: PermissionScope.WORKSPACE },
    { position, code: PERMISSIONS.ANNOUNCEMENT_CREATE, scope: PermissionScope.WORKSPACE },
  ]),
  { position: Position.TECH_LEAD, code: PERMISSIONS.GROUP_CREATE, scope: PermissionScope.WORKSPACE },
  ...[
    Position.CTO,
    Position.TECH_LEAD,
    Position.SENIOR_SOFTWARE_ENGINEER,
    Position.SOFTWARE_ENGINEER,
    Position.INTERN_SOFTWARE_ENGINEER,
    Position.OTHER,
  ].map((position) => ({
    position,
    code: PERMISSIONS.POST_CREATE,
    scope: PermissionScope.GROUP,
  })),
] as const;

async function seedRoles() {
  const roles = new Map<UserRoleType, { id: string }>();

  for (const roleName of Object.values(UserRoleType)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
      select: { id: true },
    });
    roles.set(roleName, role);
  }

  return roles;
}

async function seedPermissions() {
  const permissions = new Map<string, { id: string }>();

  for (const definition of permissionDefinitions) {
    const permission = await prisma.permission.upsert({
      where: { code: definition.code },
      update: { name: definition.name },
      create: definition,
      select: { id: true },
    });
    permissions.set(definition.code, permission);
  }

  const postCreatePermission = permissions.get(PERMISSIONS.POST_CREATE);
  if (!postCreatePermission) {
    throw new Error(`Permission not seeded: ${PERMISSIONS.POST_CREATE}`);
  }

  // Preserve existing UserPosition links while moving these positions from
  // workspace-only posting to group-only posting.
  await prisma.positionPermission.updateMany({
    where: {
      position: { in: [Position.CTO, Position.TECH_LEAD] },
      permissionId: postCreatePermission.id,
      scope: PermissionScope.WORKSPACE,
    },
    data: { scope: PermissionScope.GROUP },
  });

  for (const entry of permissionMatrix) {
    const permission = permissions.get(entry.code);
    if (!permission) throw new Error(`Permission not seeded: ${entry.code}`);

    await prisma.positionPermission.upsert({
      where: {
        position_permissionId_scope: {
          position: entry.position,
          permissionId: permission.id,
          scope: entry.scope,
        },
      },
      update: {},
      create: {
        position: entry.position,
        permissionId: permission.id,
        scope: entry.scope,
      },
    });
  }
}

async function seedEmployees(userRoleId: string) {
  const password = await bcrypt.hash(SEED_PASSWORD, 10);
  const users = new Map<string, { id: string; username: string; name: string | null }>();

  for (const employee of employees) {
    const user = await prisma.user.upsert({
      where: { email: employee.email },
      update: {
        username: employee.username,
        name: employee.name,
        password,
        avatar: SEED_AVATAR,
        verifiedAt: new Date(),
        status: UserStatus.ACTIVE,
        deletedAt: null,
      },
      create: {
        email: employee.email,
        username: employee.username,
        name: employee.name,
        password,
        avatar: SEED_AVATAR,
        verifiedAt: new Date(),
        status: UserStatus.ACTIVE,
      },
      select: { id: true, username: true, name: true },
    });

    const existingRole = await prisma.userRole.findFirst({
      where: { userId: user.id, roleId: userRoleId },
      select: { id: true },
    });
    if (!existingRole) {
      await prisma.userRole.create({
        data: { userId: user.id, roleId: userRoleId },
      });
    }

    const positionPermissions = await prisma.positionPermission.findMany({
      where: { position: employee.position },
      select: { id: true },
    });

    for (const positionPermission of positionPermissions) {
      await prisma.userPosition.upsert({
        where: {
          userId_positionPermissionId: {
            userId: user.id,
            positionPermissionId: positionPermission.id,
          },
        },
        update: { position: employee.position },
        create: {
          userId: user.id,
          position: employee.position,
          positionPermissionId: positionPermission.id,
        },
      });
    }

    users.set(employee.key, user);
  }

  return users;
}

async function seedProjectGroup(
  users: Map<string, { id: string; username: string; name: string | null }>,
) {
  const techLead = users.get('techLead');
  if (!techLead) throw new Error('Tech Lead user was not seeded');

  const group = await prisma.groupTeam.upsert({
    where: { name: 'Project Phoenix' },
    update: {
      publicId: 'seed-project-phoenix',
      createdById: techLead.id,
    },
    create: {
      publicId: 'seed-project-phoenix',
      name: 'Project Phoenix',
      createdById: techLead.id,
    },
  });

  for (const employee of employees.filter(({ key }) =>
    ['techLead', 'seniorDeveloper', 'developer', 'internDeveloper', 'employee'].includes(key),
  )) {
    const user = users.get(employee.key);
    if (!user) continue;

    await prisma.userTeam.upsert({
      where: { userId_teamId: { userId: user.id, teamId: group.id } },
      update: { position: employee.position },
      create: {
        userId: user.id,
        teamId: group.id,
        position: employee.position,
      },
    });
  }

  return group;
}

async function seedPosts(
  users: Map<string, { id: string; username: string; name: string | null }>,
  groupId: number,
) {
  const dateRangeTo = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const postDefinitions = [
    {
      publicId: 'seed-ceo-announcement',
      userKey: 'ceo',
      content: 'Thông báo sự kiện Company Town Hall tháng này.',
      type: PostType.ANNOUNCEMENT,
      visibility: VisibilityPost.WORKSPACE,
      isPinned: true,
      dateRangeTo,
    },
    {
      publicId: 'seed-hr-announcement',
      userKey: 'hr',
      content: 'Thông báo sự kiện nội bộ và lịch đăng ký tham gia.',
      type: PostType.ANNOUNCEMENT,
      visibility: VisibilityPost.WORKSPACE,
      isPinned: false,
      dateRangeTo,
    },
    {
      publicId: 'seed-cto-post',
      userKey: 'cto',
      content: 'Cập nhật định hướng kỹ thuật quý này.',
      type: PostType.POST,
      visibility: VisibilityPost.WORKSPACE,
      isPinned: false,
      dateRangeTo: null,
    },
    {
      publicId: 'seed-tech-lead-post',
      userKey: 'techLead',
      content: 'Cập nhật tiến độ kỹ thuật của Project Phoenix.',
      type: PostType.POST,
      visibility: VisibilityPost.WORKSPACE,
      isPinned: false,
      dateRangeTo: null,
    },
    ...[
      ['seniorDeveloper', 'Senior Developer chia sẻ kế hoạch triển khai trong nhóm.'],
      ['developer', 'Developer cập nhật công việc trong nhóm.'],
      ['internDeveloper', 'Intern Developer báo cáo tiến độ trong nhóm.'],
      ['employee', 'Nhân viên cập nhật nội dung liên quan đến dự án trong nhóm.'],
    ].map(([userKey, content], index) => ({
      publicId: `seed-group-post-${index + 1}`,
      userKey,
      content,
      type: PostType.POST,
      visibility: VisibilityPost.GROUP,
      isPinned: false,
      dateRangeTo: null,
    })),
  ];

  for (const definition of postDefinitions) {
    const user = users.get(definition.userKey);
    if (!user) throw new Error(`User not seeded: ${definition.userKey}`);
    const groupTeamId =
      definition.visibility === VisibilityPost.GROUP ? groupId : null;
    const userSnapshot = {
      id: user.id,
      username: user.username,
      name: user.name ?? user.username,
      bio: null,
      avatar: SEED_AVATAR,
      status: UserStatus.ACTIVE,
      verifiedAt: new Date().toISOString(),
    };

    await prisma.post.upsert({
      where: { publicId: definition.publicId },
      update: {
        userId: user.id,
        content: definition.content,
        type: definition.type,
        visibility: definition.visibility,
        isPinned: definition.isPinned,
        dateRangeTo: definition.dateRangeTo,
        groupTeamId,
        userSnapshot,
        deletedAt: null,
      },
      create: {
        publicId: definition.publicId,
        userId: user.id,
        content: definition.content,
        type: definition.type,
        visibility: definition.visibility,
        isPinned: definition.isPinned,
        dateRangeTo: definition.dateRangeTo,
        groupTeamId,
        userSnapshot,
        publishedAt: new Date(),
      },
    });
  }
}

async function main() {
  const roles = await seedRoles();
  await seedPermissions();

  const userRole = roles.get(UserRoleType.USER);
  if (!userRole) throw new Error('USER role was not seeded');

  const users = await seedEmployees(userRole.id);
  const group = await seedProjectGroup(users);
  await seedPosts(users, group.id);

  console.log(`Seeded ${employees.length} company users.`);
  console.log(`Shared seed password: ${SEED_PASSWORD}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
