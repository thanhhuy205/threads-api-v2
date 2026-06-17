import type { BaseResponse } from '@/shared/interface/base-response.interface';

export type CreateVoteDataDto = {
  totalVotes: number;
  votedCount: number;
  totalVotedCount: number;
  isVoted: boolean;
};

export type CreateVoteResponseDto = BaseResponse<CreateVoteDataDto>;
