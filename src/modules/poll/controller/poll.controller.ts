import { AUTH_MESSAGE } from "@/constants/message";
import { Request, Response } from "express";
import type {
  CreateVoteDto,
  VoteParamsDto,
} from "../dto/request/vote.request";
import { voteService } from "../service/vote.service";

class PollController {
  async createVote(
    req: Request<VoteParamsDto, {}, CreateVoteDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const result = await voteService.createVote({
      pollId: req.params.pollId,
      pollOptionId: req.body.pollOptionId,
      userId,
    });

    return res.success(200, "Vote created successfully", result);
  }
}

export const pollController = new PollController();
