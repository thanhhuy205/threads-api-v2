import type { Prisma, VerificationCodeType } from '../../../generated/prisma/client';

export const VERIFICATION_REPOSITORY = Symbol('VERIFICATION_REPOSITORY');

export type CreateVerificationCodePayload = {
  userId: string;
  type: VerificationCodeType;
  tokenHash: string;
};
export type VerificationCodeRecord = Prisma.VerificationCodeGetPayload<Record<string, never>>;

export interface VerificationRepository {
  create(payload: CreateVerificationCodePayload): Promise<VerificationCodeRecord>;
  findByUserId(userId: string): Promise<VerificationCodeRecord[]>;
  findByTokenHash(tokenHash: string): Promise<VerificationCodeRecord | null>;
  findByTokenHashAndType(
    tokenHash: string,
    type: VerificationCodeType,
  ): Promise<VerificationCodeRecord | null>;
  findLatestByUserIdAndType(
    userId: string,
    type: VerificationCodeType,
  ): Promise<VerificationCodeRecord[] | null>;
}
