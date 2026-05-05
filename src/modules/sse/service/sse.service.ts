import { SsePayload } from '@/modules/sse/interface/sse.types';
import { redisSub } from '@/providers/redis.provider';
import type { Response } from 'express';

type SseEventName = 'connected' | 'notification' | 'heartbeat';

type NotificationPayload = {
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    createdAt?: string;
};

class SseService {
    private clients = new Map<string, Set<Response>>();
    private CHANNEL = 'sse_notifications';

    private initRedisSubscriber() {
        redisSub.subscribe(this.CHANNEL);
        redisSub.on('message', (channel, message) => {
            if (channel === this.CHANNEL) {
                const { userId, event, data }: SsePayload = JSON.parse(message);
            }
        });
    }

    connect(userId: string, res: Response) {
        if (!this.clients.has(userId)) {
            this.clients.set(userId, new Set());
        }

        this.clients.get(userId)!.add(res);

        this.sendRaw(res, 'connected', {
            message: 'SSE connected',
            userId,
            connectedAt: new Date().toISOString(),
        });
    }

    disconnect(userId: string, res: Response) {
        const connections = this.clients.get(userId); // 1 user nhiều connect 
        if (connections) {
            connections.delete(res)
            if (connections.size === 0) this.disconnect(userId, res);
        }
    }

    sendNotificationToUser(userId: string, data: NotificationPayload) {
        return this.sendToUser(userId, 'notification', {
            ...data,
            createdAt: data.createdAt ?? new Date().toISOString(),
        });
    }

    sendToUser(userId: string, event: SseEventName, data: unknown) {
        const connections = this.clients.get(userId);

        if (!connections || connections.size === 0) {
            console.log('[SSE_NO_CLIENT]', {
                userId,
                event,
            });

            return 0;
        }

        let sentCount = 0;

        for (const res of connections) {
            if (res.writableEnded || res.destroyed) {
                connections.delete(res);
                continue;
            }

            this.sendRaw(res, event, data);
            sentCount++;
        }

        return sentCount;
    }

    private sendRaw(res: Response, event: SseEventName, data: unknown) {
        res.write(`event: ${event}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);

        (res as any).flush?.();
    }
}

export const sseService = new SseService();