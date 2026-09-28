import type { Prisma } from '../../../../../generated/prisma/client';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

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
const userStatusProfileSelect = { id: true, bio: true, avatar: true } as const;

export type UserProfile = Prisma.UserGetPayload<{ select: typeof userProfileSelect }>;
export type UserStatusProfile = Prisma.UserGetPayload<{
  select: typeof userStatusProfileSelect;
}>;

export interface UserRepository {
  findById(identity: string): Promise<UserProfile | null>;
  findStatusProfileById(id: string): Promise<UserStatusProfile | null>;
  updateProfile(identity: string, data: Prisma.UserUpdateInput): Promise<UserProfile>;
  create(identity: string, data: Prisma.UserUpdateInput): Promise<UserProfile>;
  findExistingIds(userIds: string[]): Promise<string[]>;
}
