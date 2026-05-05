// src/modules/sse/sse.registry.ts
import type { Response } from 'express';

class SseRegistry {
    private clients = new Map<string, Set<Response>>();

    add(userId: string, res: Response) {
        if (!this.clients.has(userId)) {
            this.clients.set(userId, new Set());
        }

        this.clients.get(userId)!.add(res);
    }

    remove(userId: string, res: Response) {
        const userClients = this.clients.get(userId);

        if (!userClients) return;

        userClients.delete(res);

        if (userClients.size === 0) {
            this.clients.delete(userId);
        }
    }

    getByUserId(userId: string): Set<Response> {
        return this.clients.get(userId) ?? new Set();
    }

    countByUserId(userId: string): number {
        return this.clients.get(userId)?.size ?? 0;
    }

    countAll(): number {
        let total = 0;

        for (const clients of this.clients.values()) {
            total += clients.size;
        }

        return total;
    }
}

export const sseRegistry = new SseRegistry();