import prisma from '@/config/prisma';
import type { Prisma } from '@prisma/client';
import type { RegisterDto } from '../dto/request/register.request.dto';

const authSessionUserSelect = {
    id: true,
    email: true,
    username: true,
    name: true,
    bio: true,
    avatar: true,
    status: true,
    password: true,
} as const;

export type AuthSessionUser = Prisma.UserGetPayload<{ select: typeof authSessionUserSelect }>;
const refreshTokenSelect = {
    id: true,
    userId: true,
    token: true,
    expireAt: true,
    sessionId: true,
    revokedAt: true,
    ip: true,
    userAgent: true,
} as const;

export type RefreshTokenRecord = Prisma.RefreshTokenGetPayload<{ select: typeof refreshTokenSelect }>;

type CreateRefreshTokenPayload = {
    userId: string;
    token: string;
    expireAt: Date;
    sessionId: string;
    ip: string;
    userAgent: string;
};

class AuthRepository {
    async createUser(payload: RegisterDto): Promise<AuthSessionUser> {
        const user = await prisma.user.create({
            data: {
                email: payload.email.trim(),
                username: payload.username.trim(),
                password: payload.password,
            },
            select: authSessionUserSelect,
        });

        return user;
    }

    async findUserByLogin(login: string): Promise<AuthSessionUser | null> {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: login }, { username: login }],
            },
            select: authSessionUserSelect,
        });

        return user;
    }

    async createRefreshToken(payload: CreateRefreshTokenPayload): Promise<void> {
        await prisma.refreshToken.create({
            data: {
                userId: payload.userId,
                token: payload.token,
                expireAt: payload.expireAt,
                sessionId: payload.sessionId,
                ip: payload.ip,
                userAgent: payload.userAgent,
            },
        });
    }

    async findRefreshTokenByToken(token: string): Promise<RefreshTokenRecord | null> {
        return prisma.refreshToken.findUnique({
            where: {
                token,
            },
            select: refreshTokenSelect,
        });
    }

    async revokeRefreshTokenById(id: number, revokedAt: Date): Promise<void> {
        await prisma.refreshToken.update({
            where: {
                id,
            },
            data: {
                revokedAt,
            },
        });
    }
    async findUserByEmail(email: string): Promise<AuthSessionUser | null> {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
            select: authSessionUserSelect,
        });

        return user;
    }

    async updatePassword(userId: string, newPassword: string): Promise<void> {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: newPassword,
            },
        });
    }
}

export const authRepository = new AuthRepository();
