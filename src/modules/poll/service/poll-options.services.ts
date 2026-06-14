import type { Prisma } from "@prisma/client";
import {
  pollOptionsRepository,
  type CreatePollOptionPayload,
} from "../repository/poll-options.repository";

export type PollOptionInput = string;

class PollOptionsService {
  createMany(
    pollId: number,
    options: PollOptionInput[],
    tx: Prisma.TransactionClient,
  ) {
    const payload: CreatePollOptionPayload[] = options.map((option) => ({
      pollId,
      optionText: option.trim(),
    }));

    return pollOptionsRepository.createMany(payload, tx);
  }

  findByPollId(pollId: number, tx?: Prisma.TransactionClient) {
    return pollOptionsRepository.findByPollId(pollId, tx);
  }
}

export const pollOptionsService = new PollOptionsService();
