import type { Prisma } from '../../../generated/prisma/client';

export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');

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

export type RefreshTokenRecord = Prisma.RefreshTokenGetPayload<{
  select: typeof refreshTokenSelect;
}>;

export type CreateRefreshTokenPayload = {
  userId: string;
  token: string;
  expireAt: Date;
  sessionId: string;
  ip: string;
  userAgent: string;
};

export interface RefreshTokenRepository {
  create(payload: CreateRefreshTokenPayload): Promise<void>;
  findByToken(token: string): Promise<RefreshTokenRecord | null>;
  revokeById(id: number, revokedAt: Date): Promise<void>;
}
