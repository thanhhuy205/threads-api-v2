import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

export type CreateVotePayload = {
  userId: string;
  pollId: number;
  pollOptionId: number;
};

class VoteRepository {
  create(
    payload: CreateVotePayload,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.vote.create({
      data: payload,
    });
  }
}

export const voteRepository = new VoteRepository();
