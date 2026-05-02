import prisma from '@/config/prisma';
import type { Prisma } from '@prisma/client';
import { RegisterDto } from '../dto/request/auth.request';

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

class AuthRepository {
    async createUser(payload: RegisterDto): Promise<AuthSessionUser> {
        const loginValue = payload.login.trim();
        const user = await prisma.user.create({
            data: {
                email: loginValue,
                username: loginValue,
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
}

export const authRepository = new AuthRepository();
