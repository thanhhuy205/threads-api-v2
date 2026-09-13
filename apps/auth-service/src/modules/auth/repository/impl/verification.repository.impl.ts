import configService from '@purse/common/config';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import type { Prisma, VerificationCodeType } from '../../../../generated/prisma/client';
import ms, { StringValue } from 'ms';
import type { VerificationRepository } from '../verification.repository';

type CreateVerificationCodePayload = {
    userId: string;
    type: VerificationCodeType;
    tokenHash: string;
};

export type VerificationCodeRecord = Prisma.VerificationCodeGetPayload<Record<string, never>>;

@Injectable()
export class VerificationRepositoryImpl implements VerificationRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(payload: CreateVerificationCodePayload): Promise<VerificationCodeRecord> {
        const verificationCode = await this.prisma.verificationCode.create({
            data: {
                userId: payload.userId,
                type: payload.type,
                tokenHash: payload.tokenHash,
                expiresAt: new Date(Date.now() + ms(configService.JWT_CONFIG.ACCESS_EXPIRES as StringValue)),
            },
        });

        return verificationCode;
    }

    async findByUserId(userId: string): Promise<VerificationCodeRecord[]> {
        return this.prisma.verificationCode.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findByTokenHash(tokenHash: string): Promise<VerificationCodeRecord | null> {
        return this.prisma.verificationCode.findUnique({
            where: { tokenHash } as Prisma.VerificationCodeWhereUniqueInput,
        });
    }

    async findByTokenHashAndType(tokenHash: string, type: VerificationCodeType): Promise<VerificationCodeRecord | null> {
        return this.prisma.verificationCode.findFirst({
            where: {
                tokenHash,
                type,
            },
        });
    }

    async findLatestByUserIdAndType(userId: string, type: VerificationCodeType): Promise<VerificationCodeRecord[] | null> {
        return this.prisma.verificationCode.findMany({
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
