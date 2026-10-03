import type { BaseResponse } from "./api";

export interface PollOption {
  id: number;
  optionText: string;
  votesCount: number;
}

export interface Poll {
  id: number;
  expiresAt: string;
  isExpired?: boolean;
  pollOptions: PollOption[];
  /** true if the current user voted on this poll */
  isVoted: boolean;
  /** pollOptionId(s) the current user voted on */
  optionPollIds: number[];
  /** total votes across all options of this poll */
  totalVotedCount: number;
  voteCount: number;
}

/**
 * Top-level poll aggregates attached to a post, summed across all of its polls.
 */
export interface PostPollAggregates {
  isVoted: boolean;
  optionPollIds: number[];
  totalVotedCount: number;
}

export interface VotePollParamsDto {
  pollId: number;
}

export interface VotePollBodyDto {
  pollOptionId: number;
}

export interface VotePollArgs extends VotePollParamsDto, VotePollBodyDto {}

export interface VotePollData {
  /** votes on the specific option that was voted */
  totalVotes: number;
  /** alias of totalVotes */
  votedCount: number;
  /** alias of totalVotes */
  totalVotedCount: number;
  isVoted: true;
}

export type VotePollResponse = BaseResponse<VotePollData>;
