import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

export type CreatePollOptionPayload = {
  pollId: number;
  optionText: string;
};

class PollOptionsRepository {
  createMany(
    payload: CreatePollOptionPayload[],
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.pollOption.createMany({
      data: payload,
    });
  }

  findByPollId(pollId: number, tx: Prisma.TransactionClient = prisma) {
    return tx.pollOption.findMany({
      where: {
        pollId,
      },
      orderBy: {
        id: "asc",
      },
    });
  }
}

export const pollOptionsRepository = new PollOptionsRepository();
