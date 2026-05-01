import { NextFunction, Request, Response } from 'express';
import { buildHealthPayload, checkDatabaseConnection } from './health.service';

export const healthCheck = (_req: Request, res: Response) => {
    res.json(buildHealthPayload());
};

export const readinessCheck = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const database = await checkDatabaseConnection();

        res.json({
            ...buildHealthPayload(),
            ...database,
        });
    } catch (error) {
        next(error);
    }
};