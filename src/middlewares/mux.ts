import configService from '@/config/config';
import { NextFunction, Request, Response } from 'express';

export const muxHandler = (req: Request, res: Response, next: NextFunction) => {
    const eventType = req.header('Mux-Event-Type');
    if (!eventType) {
        return res.error(400, 'Missing Mux-Event-Type header');
    }
    const signature = req.headers['mux-signature'] as string;
    if (!signature) {
        return res.error(400, 'Missing Mux-Signature header');
    }
    if (configService.MUX_HOOK_SECRET !== signature) {
        return res.error(401, 'Invalid Mux-Signature');
    }

    next();
}
