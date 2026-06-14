import { BadRequestException } from "@/errors/error";
import type { Prisma } from "@prisma/client";
import { pollRepository } from "../repository/poll.repository";
import {
  pollOptionsService,
  type PollOptionInput,
} from "./poll-options.services";

const DEFAULT_POLL_DURATION_HOURS = 24;
const MAX_POLL_OPTIONS = 4;

export type CreatePostPollPayload = {
  postId: number;
  options: PollOptionInput[];
  expiresAt?: Date;
};

class PollService {
  async createForPost(
    payload: CreatePostPollPayload,
    tx: Prisma.TransactionClient,
  ) {
    const options = this.normalizeOptions(payload.options);

    if (!options.length) {
      throw new BadRequestException("Poll must include at least one option");
    }

    const poll = await pollRepository.create(
      {
        postId: payload.postId,
        expiresAt: payload.expiresAt ?? this.getDefaultExpiresAt(),
      },
      tx,
    );

    await pollOptionsService.createMany(poll.id, options, tx);

    return poll;
  }

  findByPostId(postId: number, tx?: Prisma.TransactionClient) {
    return pollRepository.findByPostId(postId, tx);
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

export const pollService = new PollService();
