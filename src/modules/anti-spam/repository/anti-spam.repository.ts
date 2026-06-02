import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import type { CreateAntiSpamInput } from "../interfaces/create-anti-spam.input";
import type { FindAntiSpamByUserActionInDayInput } from "../interfaces/find-anti-spam-by-user-action-in-day.input";

type AntiSpamDbClient = Prisma.TransactionClient | typeof prisma;

class AntiSpamRepository {
    create(input: CreateAntiSpamInput, tx: AntiSpamDbClient = prisma) {
        return tx.antiSpam.create({
            data: {
                userId: input.userId,
                action: input.action,
                reason: input.reason,
            },
        });
    }

    findByUserActionInDay(
        input: FindAntiSpamByUserActionInDayInput,
        tx: AntiSpamDbClient = prisma,
    ) {
        const startAt = new Date(
            input.date.getFullYear(),
            input.date.getMonth(),
            input.date.getDate(),
        );
        const endAt = new Date(startAt);
        endAt.setDate(startAt.getDate() + 1);

        return tx.antiSpam.findFirst({
            where: {
                userId: input.userId,
                action: input.action,
                createdAt: {
                    gte: startAt,
                    lt: endAt,
                },
            },
        });
    }
}

export const antiSpamRepository = new AntiSpamRepository();
