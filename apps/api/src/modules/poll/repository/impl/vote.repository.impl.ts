import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from "@prisma/client";
import type { VoteRepository } from '../vote.repository';

export type CreateVotePayload = {
  userId: string;
  pollId: number;
  pollOptionId: number;
};

@Injectable()
export class VoteRepositoryImpl implements VoteRepository {
  constructor(private readonly prisma: PrismaService) {}

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

