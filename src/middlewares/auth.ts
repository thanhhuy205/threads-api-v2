import { ForbiddenException, UnauthorizedException } from '@/errors/error';
import { jwtService } from '@/modules/jwt/service/jwt.service';
import { ensureRedisConnection } from '@/modules/redis/service/redis.service';
import { userRepository } from '@/modules/user/repo/user.repository';
import { UserRole, UserStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

const TOKEN_INVALID = 'TOKEN_INVALID';
const USER_BANNED = 'USER_BANNED';

export const authorization = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            throw new UnauthorizedException(TOKEN_INVALID);
        }
        const token = header.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException(TOKEN_INVALID);
        }

        const redisClient = await ensureRedisConnection();
        const isBlacklisted = await redisClient.exists(`bl:at:${token}`);

        if (isBlacklisted > 0) {
            throw new UnauthorizedException(TOKEN_INVALID);
        }

        const decoded = await jwtService.verifyToken({ token });

        if (!decoded.sub) {
            throw new UnauthorizedException(TOKEN_INVALID);
        }
        const user = await userRepository.findById(decoded.sub);
        if (!user) {
            throw new UnauthorizedException(TOKEN_INVALID);
        }

        if (user.status === UserStatus.BANNED) {
            throw new ForbiddenException(USER_BANNED);
        }

        req.user = decoded;
        req.accessToken = token;
        req.isAdmin = user.role as UserRole;
        return next();
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.log(error);
        }

        if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
            throw error;
        }

        throw new UnauthorizedException(TOKEN_INVALID);
    }
};