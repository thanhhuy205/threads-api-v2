import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

export type CreatePollPayload = {
  postId: number;
  expiresAt: Date;
};

export type PollVoteCountUpdate = {
  pollId: number;
  voteCount: number;
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

  bulkUpdateVoteCount(
    updates: PollVoteCountUpdate[],
    tx: Prisma.TransactionClient = prisma,
  ) {
    if (updates.length === 0) {
      return Promise.resolve(0);
    }

    const ids = updates.map((update) => update.pollId);
    const cases = Prisma.join(
      updates.map(
        (update) =>
          Prisma.sql`WHEN ${update.pollId} THEN ${update.voteCount}`,
      ),
      " ",
    );

    return tx.$executeRaw`
      UPDATE polls
      SET vote_count = CASE id ${cases} END
      WHERE id IN (${Prisma.join(ids)})
    `;
  }
}

export const pollRepository = new PollRepository();
