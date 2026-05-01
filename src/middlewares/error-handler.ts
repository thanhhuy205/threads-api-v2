import { HttpException } from '@/errors/error';
import { NextFunction, Request, Response } from 'express';
import env from '../config/config';

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof HttpException) {
        return res.error(error.statusCode, error.message, undefined, { errorCode: error.errorCode });
    }

    if (env.NODE_ENV === 'development' && error instanceof Error && error.stack) {
        res.error(500, 'Internal server error', undefined, { stack: error.stack });
    } else {
        res.error(500, 'Internal server error');
    }
};
