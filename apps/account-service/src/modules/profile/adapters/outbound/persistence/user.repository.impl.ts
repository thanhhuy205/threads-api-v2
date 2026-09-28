import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../../../prisma/prisma.service';
import type { UserRepository } from '../../../application/ports/inbound/user.repository';

const userProfileSelect = {
  id: true,
  identity: true,
  name: true,
  bio: true,
  avatar: true,
  location: true,
  website: true,
  labelWebsite: true,
  companyName: true,
  companySize: true,
  createdAt: true,
  updatedAt: true,
} as const;

const userStatusProfileSelect = {
  id: true,
  bio: true,
  avatar: true,
} as const;

export type UserProfile = Prisma.UserGetPayload<{
  select: typeof userProfileSelect;
}>;
export type UserStatusProfile = Prisma.UserGetPayload<{
  select: typeof userStatusProfileSelect;
}>;

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(identity: string): Promise<UserProfile | null> {
    return this.prisma.user.findUnique({
      where: { identity },
      select: userProfileSelect,
    });
  }

  async findStatusProfileById(identity: string): Promise<UserStatusProfile | null> {
    return this.prisma.user.findUnique({
      where: { identity },
      select: userStatusProfileSelect,
    });
  }

  async updateProfile(
    identity: string,
    data: Prisma.UserUpdateInput,
  ): Promise<UserProfile> {
    return this.prisma.user.update({
      where: { identity },
      data,
      select: userProfileSelect,
    });
  }

  async create(
    identity: string,
    data: Prisma.UserUpdateInput,
  ): Promise<UserProfile> {
    return this.prisma.user.update({
      where: { identity },
      data,
      select: userProfileSelect,
    });
  }

  async findExistingIds(userIds: string[]) {
    if (!userIds.length) {
      return [];
    }

    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    return users.map((user) => user.id);
  }

  /*
   * Disabled until the database migration restores username/email and the
   * permission tables: getPermissionPositionByUserId, findByUsername,
   * findByUsernames, findNetworkUsernames, searchUsernameOneQuery,
   * searchUsername, and findByEmail.
   */

}

