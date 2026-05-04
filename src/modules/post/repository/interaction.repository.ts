import prisma from '@/config/prisma';
import type { CreateInteractionInput } from '../interfaces/create-interaction-input';

class InteractionRepository {
    async create(payload: CreateInteractionInput) {
        return prisma.interaction.create({
            data: {
                postId: payload.postId,
                userId: payload.userId,
                action: payload.action,
            },
        });
    }
}

export const interactionRepository = new InteractionRepository();