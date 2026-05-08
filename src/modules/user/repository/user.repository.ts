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

  async findByUsername(username: string) {
    return prisma.user.findUnique({
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
}

export const userRepository = new UserRepository();
