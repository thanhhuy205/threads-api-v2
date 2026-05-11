import { authorization } from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";
import { Router } from "express";
import { userController } from "./controller/user.controller";
import { followersQuerySchema } from "./dto/request/followers.query.dto";
import { friendRequestParamsSchema } from "./dto/request/user-id.params.dto";

const userRouter = Router();

userRouter.use(authorization);
// Hơi sai sai
userRouter.get(
  "/followers",
  validate(followersQuerySchema, "query"),
  userController.getFollower,
);
userRouter.post(
  ":username/friend-requests",
  validate(friendRequestParamsSchema, "params"),
  userController.sendFriendRequest,
);

export default userRouter;
