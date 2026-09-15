import { Inject, Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@purse/common/errors';
import type { Prisma } from '../../../../generated/prisma/client';
import {
  POLL_REPOSITORY,
  type PollRepository,
  type PollVoteCountUpdate,
} from "../../repository/poll.repository";
import { VOTE_REPOSITORY, type VoteRepository } from "../../repository/vote.repository";
import {
  POLL_OPTIONS_SERVICE,
  type PollOptionInput,
  type PollOptionsService,
} from "../poll-options.service";
import type { PollService } from '../poll.service';

const DEFAULT_POLL_DURATION_HOURS = 24;
const MAX_POLL_OPTIONS = 4;

export type CreatePostPollPayload = {
  postId: number;
  options: PollOptionInput[];
  expiresAt?: Date;
};

@Injectable()
export class PollServiceImpl implements PollService {
  constructor(
    @Inject(POLL_REPOSITORY) private readonly pollRepository: PollRepository,
    @Inject(VOTE_REPOSITORY) private readonly voteRepository: VoteRepository,
    @Inject(POLL_OPTIONS_SERVICE)
    private readonly pollOptionsService: PollOptionsService,
  ) { }
  async createForPost(
    payload: CreatePostPollPayload,
    tx: Prisma.TransactionClient,
  ) {
    const options = this.normalizeOptions(payload.options);

    if (!options.length) {
      throw new BadRequestException("Poll must include at least one option");
    }

    const poll = await this.pollRepository.create(
      {
        postId: payload.postId,
        expiresAt: payload.expiresAt ?? this.getDefaultExpiresAt(),
      },
      tx,
    );

    await this.pollOptionsService.createMany(poll.id, options, tx);

    return poll;
  }

  findByPostId(postId: number, tx?: Prisma.TransactionClient) {
    return this.pollRepository.findByPostId(postId, tx);
  }

  async assertPollOptionBelongsToPoll(
    pollOptionId: number,
    pollId: number,
    tx?: Prisma.TransactionClient,
  ) {
    const pollOption = await this.pollOptionsService.findByIdAndPollId(
      pollOptionId,
      pollId,
      tx,
    );

    if (!pollOption) {
      throw new NotFoundException("Poll option not found");
    }

    return pollOption;
  }

  incrementPollOptionVotesCount(
    pollOptionId: number,
    pollId: number,
    tx?: Prisma.TransactionClient,
  ) {
    return this.pollOptionsService.incrementVotesCount(pollOptionId, pollId, tx);
  }

  async getCountVoted(pollId: number, tx?: Prisma.TransactionClient) {
    const count = await this.voteRepository.countByPollId(pollId, tx);

    return { count };
  }

  syncVoteCounts(
    updates: PollVoteCountUpdate[],
    tx?: Prisma.TransactionClient,
  ) {
    return this.pollRepository.bulkUpdateVoteCount(updates, tx);
  }

  private normalizeOptions(options: PollOptionInput[]) {
    if (options.length > MAX_POLL_OPTIONS) {
      throw new BadRequestException(
        `Poll options must be at most ${MAX_POLL_OPTIONS}`,
      );
    }

    return options
      .map((option) => option.trim())
      .filter((option) => option.length > 0);
  }

  private getDefaultExpiresAt() {
    return new Date(Date.now() + DEFAULT_POLL_DURATION_HOURS * 60 * 60 * 1000);
  }
}

