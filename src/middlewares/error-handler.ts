import { COMMON_MESSAGE } from '@/constants/message';
import { HttpException } from '@/errors/error';
import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import env from '../config/config';

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof HttpException) {
        return res.error(error.statusCode, error.message, undefined, { errorCode: error.errorCode });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log('Prisma known request error:', error.code, error.meta);
        switch (error.code) {
            case 'P2002':
                return res.error(409, COMMON_MESSAGE.RESOURCE_ALREADY_EXISTS, undefined, { field: error.meta?.target });

            case 'P2025':
                return res.error(404, COMMON_MESSAGE.RESOURCE_NOT_FOUND, undefined, { field: error.meta?.target });

            case 'P2003':
                return res.error(400, COMMON_MESSAGE.INVALID_RELATION_REFERENCE, undefined, { field: error.meta?.target });

            case 'P2011':
            case 'P2012':
            case 'P2013':
                return res.error(400, COMMON_MESSAGE.MISSING_REQUIRED_DATA, undefined, { field: error.meta?.target });

            default:
                return res.error(400, COMMON_MESSAGE.DATABASE_REQUEST_ERROR, undefined, { field: error.meta?.target });
        }
    }

    if (env.NODE_ENV === 'development' && error instanceof Error && error.stack) {
        return res.error(500, COMMON_MESSAGE.INTERNAL_SERVER_ERROR, undefined, { stack: error.stack });
    } else {
        return res.error(500, COMMON_MESSAGE.INTERNAL_SERVER_ERROR);
    }
};
