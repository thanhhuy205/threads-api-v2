import { Prisma } from "@prisma/client";
import type { CreateAntiSpamInput } from "../interfaces/create-anti-spam.input";
import type { FindAntiSpamByUserActionInDayInput } from "../interfaces/find-anti-spam-by-user-action-in-day.input";
import { antiSpamRepository } from "../repository/anti-spam.repository";

class AntiSpamService {
    create(input: CreateAntiSpamInput, tx?: Prisma.TransactionClient) {
        return antiSpamRepository.create(input, tx);
    }

    findByUserActionInDay(
        input: FindAntiSpamByUserActionInDayInput,
        tx?: Prisma.TransactionClient,
    ) {
        return antiSpamRepository.findByUserActionInDay(input, tx);
    }
}

export const antiSpamService = new AntiSpamService();
