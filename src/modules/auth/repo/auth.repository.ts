import prisma from '@/config/prisma';
import { RegisterDto } from '../dto/auth.dto';

export type AuthUser = {
    id: number;
    email: string;
    username: string;
};

class AuthRepository {
    async createUser(payload: RegisterDto): Promise<AuthUser> {
        const loginValue = payload.login.trim();
        const user = await prisma.user.create({
            data: {
                email: loginValue,
                username: loginValue,
                password: payload.password,
            },
            select: {
                id: true,
                email: true,
                username: true,
            },
        });

        return user;
    }

    async findUserByLogin(login: string): Promise<AuthUser | null> {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: login }, { username: login }],
            },
            select: {
                id: true,
                email: true,
                username: true,
            },
        });

        return user;
    }
}

export const authRepository = new AuthRepository();
