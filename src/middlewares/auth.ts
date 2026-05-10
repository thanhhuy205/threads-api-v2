import { AUTH_MESSAGE } from '@/constants/message';
import { ForbiddenException, UnauthorizedException } from '@/errors/error';
import { jwtService } from '@/modules/jwt/service/jwt.service';
import { userRepository } from '@/modules/user/repository/user.repository';
import { redisService } from '@/providers/redis.provider';
import { UserStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export const authorization = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
        }
        const token = header.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
        }

        const isBlacklisted = await redisService.exists(`bl:at:${token}`);

        if (isBlacklisted > 0) {
            throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
        }

        const decoded = await jwtService.verifyToken({ token });

        if (!decoded.sub) {
            throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
        }
        const user = await userRepository.findById(decoded.sub);
        if (!user) {
            throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
        }

        if (user.status === UserStatus.BANNED) {
            throw new ForbiddenException(AUTH_MESSAGE.USER_BANNED);
        }

        req.user = decoded;
        req.accessToken = token;
        // req.isAdmin = user.role as UserRoleType;
        return next();
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.log(error);
        }

        if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
            throw error;
        }

        throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }
};