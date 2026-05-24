import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

class UserKarmaRepository {
    async create(userId: string, karma: number, tx: Prisma.TransactionClient = prisma) {
        return tx.userKarma.create({
            data: {
                userId,
                karma,
            },
        });
    }
}

export const userKarmaRepository = new UserKarmaRepository();