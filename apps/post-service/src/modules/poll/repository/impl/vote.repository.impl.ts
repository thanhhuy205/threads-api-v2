import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Prisma } from '../../../../generated/prisma/client';
import type { VoteRepository } from '../vote.repository';

export type CreateVotePayload = {
  userId: string;
  pollId: number;
  pollOptionId: number;
};

@Injectable()
export class VoteRepositoryImpl implements VoteRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(
    payload: CreateVotePayload,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).vote.create({
      data: payload,
    });
  }

  countByPollId(pollId: number, tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).vote.count({
      where: {
        pollId,
      },
    });
  }
}

