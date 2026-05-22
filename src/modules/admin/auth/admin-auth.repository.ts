import prisma from "@/config/prisma";
import type { Prisma } from "@prisma/client";

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

class AdminAuthRepository {
  async findUserByLogin(login: string): Promise<AdminAuthUser | null> {
    return prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
      select: adminAuthUserSelect,
    });
  }
}

export const adminAuthRepository = new AdminAuthRepository();
