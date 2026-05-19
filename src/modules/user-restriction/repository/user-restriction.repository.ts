import prisma from "@/config/prisma";
import { Prisma, UserRestrictionType } from "@prisma/client";

type CreateUserRestrictionInput = {
    userId: string;
    type: UserRestrictionType;
    reason?: string;
    expiresAt: Date;
};

class UserRestrictionRepository {
    async findFirstActive(
        userId: string,
        tx: Prisma.TransactionClient = prisma,
    ) {
        return tx.userRestriction.findFirst({
            where: {
                userId,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
    }

    async create(
        data: CreateUserRestrictionInput,
        tx: Prisma.TransactionClient = prisma,
    ) {
        return tx.userRestriction.create({
            data: {
                userId: data.userId,
                type: data.type,
                reason: data.reason,
                expiresAt: data.expiresAt,
            },
        });
    }
}

export const userRestrictionRepository = new UserRestrictionRepository();
