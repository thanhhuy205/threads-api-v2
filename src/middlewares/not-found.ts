import { NextFunction, Request, Response } from 'express';

export const notFoundHandler = (_req: Request, res: Response, _next: NextFunction) => {
    return res.error(404, 'Not found');
};
