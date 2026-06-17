import { authorization } from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";
import { Router } from "express";
import { pollController } from "./controller/poll.controller";
import {
  createVoteSchema,
  voteParamsSchema,
} from "./dto/request/vote.request";

const pollRouter = Router();

pollRouter.use(authorization);

pollRouter.post(
  "/:pollId/vote",
  validate(voteParamsSchema, "params"),
  validate(createVoteSchema),
  pollController.createVote,
);

export default pollRouter;
