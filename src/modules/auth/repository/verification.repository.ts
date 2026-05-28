import configService from '@/config/config';
import prisma from '@/config/prisma';
import type { Prisma, VerificationCodeType } from '@prisma/client';
import ms, { StringValue } from 'ms';

type CreateVerificationCodePayload = {
    userId: string;
    type: VerificationCodeType;
    tokenHash: string;
};

export type VerificationCodeRecord = Prisma.VerificationCodeGetPayload<Record<string, never>>;

class VerificationRepository {
    async create(payload: CreateVerificationCodePayload): Promise<VerificationCodeRecord> {
        const verificationCode = await prisma.verificationCode.create({
            data: {
                userId: payload.userId,
                type: payload.type,
                tokenHash: payload.tokenHash,
                expiresAt: new Date(Date.now() + ms(configService.ACCESS_EXPIRES as StringValue)),
            },
        });

        return verificationCode;
    }

    async findByUserId(userId: string): Promise<VerificationCodeRecord[]> {
        return prisma.verificationCode.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findByTokenHash(tokenHash: string): Promise<VerificationCodeRecord | null> {
        return prisma.verificationCode.findUnique({
            where: { tokenHash } as Prisma.VerificationCodeWhereUniqueInput,
        });
    }

    async findByTokenHashAndType(tokenHash: string, type: VerificationCodeType): Promise<VerificationCodeRecord | null> {
        return prisma.verificationCode.findFirst({
            where: {
                tokenHash,
                type,
            },
        });
    }

    async findLatestByUserIdAndType(userId: string, type: VerificationCodeType): Promise<VerificationCodeRecord[] | null> {
        return prisma.verificationCode.findMany({
            where: {
                userId,
                type,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}

export const verificationRepository = new VerificationRepository();
