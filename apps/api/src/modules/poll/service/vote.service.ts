export const VOTE_SERVICE = Symbol('VOTE_SERVICE');

export type CreateVotePayload = {
  pollId: number;
  pollOptionId: number;
  userId: string;
};

export interface VoteService {
  createVote(payload: CreateVotePayload): Promise<any>;
}
