import prisma from "@/config/prisma";
import { KarmaReason, Prisma } from "@prisma/client";

type CreateKarmaTransactionInput = {
    userId: string;
    circleId: number;
    delta: number;
    reason: KarmaReason;
};

class KarmaTransactionRepository {
    async create(
        data: CreateKarmaTransactionInput,
        tx: Prisma.TransactionClient = prisma,
    ) {
        return tx.karmaTransaction.create({
            data: {
                userId: data.userId,
                circleId: data.circleId,
                delta: data.delta,
                reason: data.reason,
            },
        });
    }
}

export const karmaTransactionRepository = new KarmaTransactionRepository();
