import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@post-service/prisma/prisma.service';
import { Prisma } from 'apps/post-service/generated/prisma';
import type { PollRepository } from '../poll.repository';

export type CreatePollPayload = {
  postId: number;
  expiresAt: Date;
};

export type PollVoteCountUpdate = {
  pollId: number;
  voteCount: number;
};

type PrismaClientOrTransaction =
  | PrismaService
  | Prisma.TransactionClient;

@Injectable()
export class PollRepositoryImpl implements PollRepository {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) { }

  create(
    payload: CreatePollPayload,
    tx: PrismaClientOrTransaction = this.prisma,
  ) {
    return tx.poll.create({
      data: payload,
    });
  }

  findByPostId(
    postId: number,
    tx: PrismaClientOrTransaction = this.prisma,
  ) {
    return tx.poll.findFirst({
      where: {
        postId,
      },
      include: {
        pollOptions: {
          orderBy: {
            id: 'asc',
          },
        },
      },
    });
  }

  bulkUpdateVoteCount(
    updates: PollVoteCountUpdate[],
    tx: PrismaClientOrTransaction = this.prisma,
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
      ' ',
    );

    return tx.$executeRaw`
      UPDATE polls
      SET vote_count = CASE id ${cases} END
      WHERE id IN (${Prisma.join(ids)})
    `;
  }
}