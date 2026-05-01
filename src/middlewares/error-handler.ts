import { NextFunction, Request, Response } from 'express';
import env from '../config/env';

const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Internal server error';

    const payload: {
        success: false;
        message: string;
        stack?: string;
    } = {
        success: false,
        message,
    };

    if (env.NODE_ENV === 'development' && error instanceof Error && error.stack) {
        payload.stack = error.stack;
    }

    res.status(statusCode).json(payload);
};

export default errorHandler;