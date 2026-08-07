import { Injectable } from '@nestjs/common';
import type { Prisma } from "@prisma/client";
import { PrismaService } from '@/shared/database/prisma.service';

const adminAuthUserSelect = {
  id: true,
  email: true,
  username: true,
  name: true,
  bio: true,
  avatar: true,
  status: true,
  password: true,
  createdAt: true,
  verifiedAt: true,
  userRoles: {
    select: {
      role: {
        select: {
          name: true,
        },
      },
    },
  },
} as const;

export type AdminAuthUser = Prisma.UserGetPayload<{
  select: typeof adminAuthUserSelect;
}>;

@Injectable()
export class AdminAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByLogin(login: string): Promise<AdminAuthUser | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
      select: adminAuthUserSelect,
    });
  }
}
