import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from "@prisma/client";

const userProfileSelect = {
  id: true,
  email: true,
  username: true,
  name: true,
  bio: true,
  avatar: true,
  verifiedAt: true,
  status: true,
  location: true,
  website: true,
  labelWebsite: true,
  createdAt: true,
} as const;

const userByUsernameSelect = {
  id: true,
  username: true,
  name: true,
  bio: true,
  avatar: true,
  verifiedAt: true,
  location: true,
  website: true,
  labelWebsite: true,
} as const;

const userBasicIdentitySelect = {
  id: true,
  username: true,
} as const;

const userStatusProfileSelect = {
  id: true,
  bio: true,
  avatar: true,
} as const;

export type UserProfile = Prisma.UserGetPayload<{
  select: typeof userProfileSelect;
}>;
export type UserBasicIdentity = Prisma.UserGetPayload<{
  select: typeof userBasicIdentitySelect;
}>;
export type UserStatusProfile = Prisma.UserGetPayload<{
  select: typeof userStatusProfileSelect;
}>;
export type UserUsernameItem = {
  username: string;
  id: string;
  avatar: string | null;
  name: string | null;
  verifiedAt: Date | null;
};

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(id: string): Promise<UserProfile | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: userProfileSelect,
    });
  }

  async findStatusProfileById(id: string): Promise<UserStatusProfile | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: userStatusProfileSelect,
    });
  }

  async findByUsername(
    username: string,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).user.findUnique({
      where: {
        username,
      },
      select: userByUsernameSelect,
    });
  }

  async updateProfile(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<UserProfile> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
      select: userProfileSelect,
    });
  }

  async findByUsernames(
    usernames: string[],
    tx?: Prisma.TransactionClient,
  ): Promise<UserBasicIdentity[]> {
    if (!usernames.length) {
      return [];
    }

    return (tx ?? this.prisma).user.findMany({
      where: {
        username: {
          in: usernames,
        },
      },
      select: userBasicIdentitySelect,
    });
  }

  async findNetworkUsernames({
    userId,
    query,
    after,
    take = 10,
  }: {
    userId: string;
    query: string;
    after?: string;
    take?: number;
  }): Promise<UserUsernameItem[]> {
    return this.prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
        username: {
          contains: query,
        },
      },
      orderBy: {
        username: "asc",
      },
      take: take + 1,
      skip: after ? 1 : 0,
      cursor: after
        ? {
          username: after,
        }
        : undefined,
      select: {
        avatar: true,
        id: true,
        username: true,
        name: true,
        verifiedAt: true,
      },
    });
  }


  async findExistingIds(userIds: string[]) {
    if (!userIds.length) {
      return [];
    }

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
      },
    });

    return users.map((user) => user.id);
  }


  async searchUsernameOneQuery(query: string) {
    return this.prisma.user.findMany({
      where: {
        username: {
          startsWith: query,
        },
      },
      orderBy: {
        username: "asc",
      },
      take: 40,
      select: {
        id: true,
        username: true,
        name: true,
        verifiedAt: true,
      },
    });
  }

  async searchUsername(query: string) {
    const rows = await this.prisma.$queryRaw<UserUsernameItem[]>`
      SELECT username, id, avatar, name, verified_at as verifiedAt
      FROM users
      WHERE MATCH(username , name) AGAINST (${query} IN BOOLEAN MODE)
        AND deleted_at IS NULL
      ORDER BY MATCH(username, name) AGAINST (${query} IN BOOLEAN MODE) DESC, username ASC
      LIMIT 40
    `;

    return rows;
  }
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        verifiedAt: true,
      },
    });
  }
}

