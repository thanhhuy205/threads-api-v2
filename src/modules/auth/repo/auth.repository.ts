import prisma from '@/config/prisma';
import type { Prisma } from '@prisma/client';
import { RegisterDto } from '../dto/request/auth.request';

const authUserSelect = {
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
    deletedAt: true,
    createdAt: true,
    updatedAt: true,
} as const;

export type AuthUser = Prisma.UserGetPayload<{ select: typeof authUserSelect }>;

class AuthRepository {
    async createUser(payload: RegisterDto): Promise<AuthUser> {
        const loginValue = payload.login.trim();
        const user = await prisma.user.create({
            data: {
                email: loginValue,
                username: loginValue,
                password: payload.password,
            },
            select: authUserSelect,
        });

        return user;
    }

    async findUserByLogin(login: string): Promise<AuthUser | null> {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: login }, { username: login }],
            },
            select: authUserSelect,
        });

        return user;
    }
}

export const authRepository = new AuthRepository();
