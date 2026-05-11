import prisma from "@/config/prisma";
import type { Prisma } from "@prisma/client";

const userProfileSelect = {
  id: true,
  email: true,
  username: true,
  name: true,
  bio: true,
  avatar: true,
  role: true,
  verifiedAt: true,
  status: true,
  followersCount: true,
  followingCount: true,
  postsCount: true,
  isPrivate: true,
  location: true,
  website: true,
  createdAt: true,
} as const;

export type UserProfile = Prisma.UserGetPayload<{
  select: typeof userProfileSelect;
}>;

class UserRepository {
  async findById(id: string): Promise<UserProfile | null> {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: userProfileSelect,
    });
  }

  async findByUsername(
    username: string,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatar: true,
        verifiedAt: true,
        followersCount: true,
        followingCount: true,
        postsCount: true,
        isPrivate: true,
        location: true,
        website: true,
      },
    });
  }

  async findExistingIds(userIds: string[]) {
    if (!userIds.length) {
      return [];
    }

    const users = await prisma.user.findMany({
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

  async incrementFollowersCount(
    userId: string,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.user.update({
      where: {
        id: userId,
      },
      data: {
        followersCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        followersCount: true,
      },
    });
  }

  async decrementFollowersCount(
    userId: string,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.user.updateMany({
      where: {
        id: userId,
        followersCount: {
          gt: 0,
        },
      },
      data: {
        followersCount: {
          decrement: 1,
        },
      },
    });
  }
}

export const userRepository = new UserRepository();
