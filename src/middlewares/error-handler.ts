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
                return res.error(409, 'Resource already exists', undefined, { field: error.meta?.target });

            case 'P2025':
                return res.error(404, 'Resource not found', undefined, { field: error.meta?.target });

            case 'P2003':
                return res.error(400, 'Invalid relation reference', undefined, { field: error.meta?.target });

            case 'P2011':
            case 'P2012':
            case 'P2013':
                return res.error(400, 'Missing required data', undefined, { field: error.meta?.target });

            default:
                return res.error(400, 'Database request error', undefined, { field: error.meta?.target });
        }
    }

    if (env.NODE_ENV === 'development' && error instanceof Error && error.stack) {
        res.error(500, 'Internal server error', undefined, { stack: error.stack });
    } else {
        res.error(500, 'Internal server error');
    }
};
