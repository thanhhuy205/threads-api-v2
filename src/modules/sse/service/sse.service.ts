import { SseEventName, SsePayload } from '@/modules/sse/interface/sse.types';
import { redisService as redisPub, redisSub } from '@/providers/redis.provider'; // ← cần cả pub và sub
import type { Response } from 'express';

type NotificationPayload = {
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    createdAt?: string;
};

class SseService {
    private clients = new Map<string, Set<Response>>();
    private readonly CHANNEL = 'sse_notifications';

    constructor() {
        this.initRedisSubscriber();
        this.startCleanup();
    }

    private initRedisSubscriber() {
        void redisSub.subscribe(this.CHANNEL).catch((error) => {
            console.error('[SSE] Redis subscribe error:', error);
        });

        redisSub.on('message', (channel, message) => {
            if (channel !== this.CHANNEL) return;

            try {
                const { userId, event, data }: SsePayload = JSON.parse(message);
                this.sendToUser(userId, event, data);
            } catch (err) {
                console.error('[SSE] Parse message error:', err);
            }
        });
    }

    // Hàm này các service khác sẽ gọi để gửi thông báo
    public async sendNotificationToUser(userId: string, data: NotificationPayload) {
        const payload: SsePayload = {
            userId,
            event: 'notification',
            data: {
                ...data,
                createdAt: data.createdAt ?? new Date().toISOString(),
            }
        };
        return redisPub.publish(this.CHANNEL, JSON.stringify(payload));
    }

    connect(userId: string, res: Response) {
        if (!this.clients.has(userId)) {
            this.clients.set(userId, new Set());
        }

        this.clients.get(userId)!.add(res);

        res.on('close', () => this.disconnect(userId, res));
        res.on('finish', () => this.disconnect(userId, res));
    }

    disconnect(userId: string, res: Response) {
        const connections = this.clients.get(userId);
        if (!connections) return;

        connections.delete(res);

        if (connections.size === 0) {
            this.clients.delete(userId);
        }
    }

    private sendToUser(userId: string, event: SseEventName, data: unknown) {
        const connections = this.clients.get(userId);
        if (!connections || connections.size === 0) return 0;

        let sentCount = 0;
        for (const res of [...connections]) {
            if (res.writableEnded || res.destroyed || !res.writable) {
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

    private startCleanup() {
        setInterval(() => this.clearDeadConnection(), 30 * 1000);
    }

    clearDeadConnection() {
        let removed = 0;
        for (const [userId, connections] of this.clients.entries()) {
            for (const res of [...connections]) {
                if (res.writableEnded || res.destroyed || !res.writable) {
                    connections.delete(res);
                    removed++;
                }
            }
            if (connections.size === 0) {
                this.clients.delete(userId);
            }
        }
        if (removed > 0) {
            console.log(`[SSE] Cleaned ${removed} dead connections`);
        }
    }
}

export const sseService = new SseService();
