import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from "@prisma/client";

export type CreatePollPayload = {
  postId: number;
  expiresAt: Date;
};

export type PollVoteCountUpdate = {
  pollId: number;
  voteCount: number;
};

@Injectable()
export class PollRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    payload: CreatePollPayload,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).poll.create({
      data: payload,
    });
  }

  findByPostId(postId: number, tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).poll.findFirst({
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
    tx?: Prisma.TransactionClient,
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

    return (tx ?? this.prisma).$executeRaw`
      UPDATE polls
      SET vote_count = CASE id ${cases} END
      WHERE id IN (${Prisma.join(ids)})
    `;
  }
}

