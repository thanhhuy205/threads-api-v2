// src/modules/sse/sse.controller.ts
import { sseService } from '@/modules/sse/service/sse.service';
import type { Request, Response } from 'express';
import { AUTH_MESSAGE } from '@/constants/message';

class SseController {
    connect(req: Request, res: Response) {
        const userId = req.user?.sub;
        if (!userId) {
            return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');

        res.flushHeaders?.();

        sseService.connect(userId, res);
        res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Connected' })}\n\n`);
        (res as any).flush?.();

        const heartbeat = setInterval(() => {
            res.write(`: ping\n\n`);
            (res as any).flush?.();
        }, 25000);

        req.on('close', () => {
            clearInterval(heartbeat);
            sseService.disconnect(userId, res);
        });
    }
}

export const sseController = new SseController();
