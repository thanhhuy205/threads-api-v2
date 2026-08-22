import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from "../../../../../generated/prisma";
import type { PollOptionsRepository } from '../poll-options.repository';

export type CreatePollOptionPayload = {
  pollId: number;
  optionText: string;
};

@Injectable()
export class PollOptionsRepositoryImpl implements PollOptionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createMany(
    payload: CreatePollOptionPayload[],
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).pollOption.createMany({
      data: payload,
    });
  }

  findByPollId(pollId: number, tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).pollOption.findMany({
      where: {
        pollId,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  findByIdAndPollId(
    id: number,
    pollId: number,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).pollOption.findFirst({
      where: {
        id,
        pollId,
      },
    });
  }

  incrementVotesCount(
    id: number,
    pollId: number,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).pollOption.update({
      where: {
        id_pollId: {
          id,
          pollId,
        },
      },
      data: {
        votesCount: {
          increment: 1,
        },
      },
    });
  }
}

