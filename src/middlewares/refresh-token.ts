import type { NextFunction, Request, Response } from 'express';
export const refreshTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.headers['x-refresh-token'] as string | undefined;
        if (!refreshToken) {
            return res.error(400, 'Refresh token is required in the x-refresh-token header');
        }

        req.refreshToken = refreshToken;
        next();
    }

    catch (error) {
        console.error('Error in refresh token middleware:', error);
        return res.error(500, 'An error occurred while processing the refresh token');
    }
}