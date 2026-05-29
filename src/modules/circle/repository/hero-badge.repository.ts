import prisma from "@/config/prisma";
import { BadgeType, Prisma } from "@prisma/client";

type CreateHeroBadgeInput = {
    userId: string;
    circleId: number;
    type: BadgeType;
};

class HeroBadgeRepository {
    async upsert(
        data: CreateHeroBadgeInput,
        tx: Prisma.TransactionClient = prisma,
    ) {
        const expireAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

        return tx.heroBadge.upsert({
            where: {
                userId_circleId: {
                    userId: data.userId,
                    circleId: data.circleId,
                },
            },
            update: {
                expireAt,
            },
            create: {
                userId: data.userId,
                circleId: data.circleId,
                type: data.type,
                expireAt,
            },
        });
    }
}

export const heroBadgeRepository = new HeroBadgeRepository();
