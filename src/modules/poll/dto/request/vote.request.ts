import { z } from "zod";

export const voteParamsSchema = z.object({
  pollId: z.coerce.number().int().positive(),
});

export const createVoteSchema = z.object({
  pollOptionId: z.coerce.number().int().positive(),
});

export type VoteParamsDto = z.infer<typeof voteParamsSchema>;
export type CreateVoteDto = z.infer<typeof createVoteSchema>;
