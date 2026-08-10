import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from "@prisma/client";

export type CreateVotePayload = {
  userId: string;
  pollId: number;
  pollOptionId: number;
};

@Injectable()
export class VoteRepository {
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

