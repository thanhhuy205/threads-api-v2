// src/modules/sse/sse.controller.ts
import { sseService } from '@/modules/sse/service/sse.service';
import type { Request, Response } from 'express';
import { redisSub } from '../../../providers/redis.provider';

class SseController {
    async connect(req: Request, res: Response) {
        const userId = req.user?.sub;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');

        res.flushHeaders?.();

        sseService.connect(userId, res);
        const heartbeat = setInterval(() => {
            res.write(`: ping\n\n`);
        }, 25000);

        const channel = `user:${userId}`;

        await redisSub.subscribe(channel, (message) => {
            res.write(`data: ${message}\n\n`);
        });

        req.on('close', async () => {
            clearInterval(heartbeat);
            await redisSub.unsubscribe(channel);
            sseService.disconnect(userId, res);
        });
    }
}

export const sseController = new SseController();