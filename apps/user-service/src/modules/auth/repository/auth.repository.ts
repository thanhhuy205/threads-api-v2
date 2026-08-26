import type { Prisma } from 'apps/api/generated/prisma';

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

export const refreshTokenSelect = {
  id: true,
  userId: true,
  token: true,
  expireAt: true,
  sessionId: true,
  revokedAt: true,
  ip: true,
  userAgent: true,
} as const;

export type AuthSessionUser = Prisma.UserGetPayload<{
  select: typeof authSessionUserSelect;
}>;

export type RefreshTokenRecord = Prisma.RefreshTokenGetPayload<{
  select: typeof refreshTokenSelect;
}>;

export type CreateAuthUserPayload = {
  email: string;
  username: string;
  password: string;
};

export type CreateRefreshTokenPayload = {
  userId: string;
  token: string;
  expireAt: Date;
  sessionId: string;
  ip: string;
  userAgent: string;
};

export interface AuthRepository {
  createUser(payload: CreateAuthUserPayload): Promise<AuthSessionUser>;
  findUserByLogin(login: string): Promise<AuthSessionUser | null>;
  createRefreshToken(payload: CreateRefreshTokenPayload): Promise<void>;
  findRefreshTokenByToken(token: string): Promise<RefreshTokenRecord | null>;
  revokeRefreshTokenById(id: number, revokedAt: Date): Promise<void>;
  findUserByEmail(email: string): Promise<AuthSessionUser | null>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
  updateVerifiedEmail(userId: string): Promise<void>;
}
