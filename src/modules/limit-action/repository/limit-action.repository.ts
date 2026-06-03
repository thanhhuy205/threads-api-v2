import prisma from "@/config/prisma";
import { ActionType } from "@prisma/client";

type CreateLimitActionInput = {
    userId: string;
    type: ActionType;
    count?: number;
    resetAt: Date;
};

class LimitActionRepository {
    create(input: CreateLimitActionInput) {
        return prisma.limitActionAI.create({
            data: {
                userId: input.userId,
                type: input.type,
                count: input.count,
                resetAt: input.resetAt,
            },
        });
    }

    findManyByUserId(userId: string) {
        return prisma.limitActionAI.findMany({
            where: {
                userId,
            },
        });
    }
}

export const limitActionRepository = new LimitActionRepository();