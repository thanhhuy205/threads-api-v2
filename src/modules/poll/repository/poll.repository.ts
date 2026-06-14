import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

export type CreatePollPayload = {
  postId: number;
  expiresAt: Date;
};

class PollRepository {
  create(
    payload: CreatePollPayload,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.poll.create({
      data: payload,
    });
  }

  findByPostId(postId: number, tx: Prisma.TransactionClient = prisma) {
    return tx.poll.findFirst({
      where: {
        postId,
      },
      include: {
        pollOptions: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });
  }
}

export const pollRepository = new PollRepository();
