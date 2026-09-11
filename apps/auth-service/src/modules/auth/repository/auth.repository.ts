import type { Prisma } from 'apps/auth-service/generated/prisma';

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');

export const authSessionUserSelect = {
  id: true,
  email: true,
  username: true,
  name: true,
  bio: true,
  avatar: true,
  verifiedAt: true,
  status: true,
  createdAt: true,
  password: true,
} as const;

export type AuthSessionUser = Prisma.UserGetPayload<{
  select: typeof authSessionUserSelect;
}>;

export type CreateAuthUserPayload = {
  email: string;
  username: string;
  password: string;
};

export interface AuthRepository {
  createUser(payload: CreateAuthUserPayload): Promise<AuthSessionUser>;
  findUserByLogin(login: string): Promise<AuthSessionUser | null>;
  findUserByEmail(email: string): Promise<AuthSessionUser | null>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
  updateVerifiedEmail(userId: string): Promise<void>;
}
