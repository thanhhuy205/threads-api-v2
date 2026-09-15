import { Inject, Injectable } from '@nestjs/common';
import type { Prisma } from '../../../../generated/prisma/client';
import {
  POLL_OPTIONS_REPOSITORY,
  type CreatePollOptionPayload,
  type PollOptionsRepository,
} from "../../repository/poll-options.repository";
import type { PollOptionsService } from '../poll-options.service';

export type PollOptionInput = string;

@Injectable()
export class PollOptionsServiceImpl implements PollOptionsService {
  constructor(
    @Inject(POLL_OPTIONS_REPOSITORY)
    private readonly pollOptionsRepository: PollOptionsRepository,
  ) { }
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

