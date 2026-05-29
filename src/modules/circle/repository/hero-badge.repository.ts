import prisma from "@/config/prisma";
import { BadgeType, Prisma } from "@prisma/client";

type CreateHeroBadgeInput = {
    userId: string;
    circleId: number;
    type: BadgeType;
};

class HeroBadgeRepository {
    async create(
        data: CreateHeroBadgeInput,
        tx: Prisma.TransactionClient = prisma,
    ) {
        return tx.heroBadge.create({
            data: {
                userId: data.userId,
                circleId: data.circleId,
                type: data.type,
            },
        });
    }
}

export const heroBadgeRepository = new HeroBadgeRepository();
