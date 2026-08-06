import type { Prisma } from "@prisma/client";
import { Injectable } from '@nestjs/common';
import {
  PollOptionsRepository,
  type CreatePollOptionPayload,
} from "../repository/poll-options.repository";

export type PollOptionInput = string;

@Injectable()
export class PollOptionsService {
  constructor(private readonly pollOptionsRepository: PollOptionsRepository) {}
  createMany(
    pollId: number,
    options: PollOptionInput[],
    tx: Prisma.TransactionClient,
  ) {
    const payload: CreatePollOptionPayload[] = options.map((option) => ({
      pollId,
      optionText: option.trim(),
    }));

    return this.pollOptionsRepository.createMany(payload, tx);
  }

  findByPollId(pollId: number, tx?: Prisma.TransactionClient) {
    return this.pollOptionsRepository.findByPollId(pollId, tx);
  }

  findByIdAndPollId(
    id: number,
    pollId: number,
    tx?: Prisma.TransactionClient,
  ) {
    return this.pollOptionsRepository.findByIdAndPollId(id, pollId, tx);
  }

  incrementVotesCount(
    id: number,
    pollId: number,
    tx?: Prisma.TransactionClient,
  ) {
    return this.pollOptionsRepository.incrementVotesCount(id, pollId, tx);
  }
}

