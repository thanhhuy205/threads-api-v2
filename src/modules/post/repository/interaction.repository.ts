import prisma from '@/config/prisma';
import type { CreateInteractionInput } from '../interfaces/create-interaction-input';

class InteractionRepository {
    async create(payload: CreateInteractionInput) {
        return prisma.interaction.upsert({
            where: {
                userId_postId_action: {
                    userId: payload.userId,
                    postId: payload.postId,
                    action: payload.action,
                },
            },
            update: {
                action: payload.action,
            },
            create: {
                postId: payload.postId,
                userId: payload.userId,
                action: payload.action,
            },
        });
    }
}

export const interactionRepository = new InteractionRepository();