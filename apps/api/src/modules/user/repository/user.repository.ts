import type { Prisma } from '@prisma/client';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

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
const userBasicIdentitySelect = { id: true, username: true } as const;
const userStatusProfileSelect = { id: true, bio: true, avatar: true } as const;

export type UserProfile = Prisma.UserGetPayload<{ select: typeof userProfileSelect }>;
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

export interface UserRepository {
  findById(id: string): Promise<any>;
  getPermissionPositionByUserId(userId: string): Promise<any>;
  findStatusProfileById(id: string): Promise<UserStatusProfile | null>;
  findByUsername(username: string, tx?: Prisma.TransactionClient): Promise<any>;
  updateProfile(id: string, data: Prisma.UserUpdateInput): Promise<any>;
  findByUsernames(usernames: string[], tx?: Prisma.TransactionClient): Promise<UserBasicIdentity[]>;
  findNetworkUsernames(input: {
    userId: string;
    query: string;
    after?: string;
    take?: number;
  }): Promise<UserUsernameItem[]>;
  findExistingIds(userIds: string[]): Promise<string[]>;
  searchUsernameOneQuery(query: string): Promise<any[]>;
  searchUsername(query: string): Promise<UserUsernameItem[]>;
  findByEmail(email: string): Promise<any>;
}
