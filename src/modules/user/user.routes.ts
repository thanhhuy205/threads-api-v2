import { authorization } from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";
import { Router } from "express";
import { userController } from "./controller/user.controller";
import { followersQuerySchema } from "./dto/request/followers.query.dto";
import { friendRequestParamsSchema } from "./dto/request/user-id.params.dto";
import { friendRequestSchema } from "./dto/request/friend-id.params.dto";
import { usernameParamsSchema } from "./dto/request/username.params.dto";

const userRouter = Router();

userRouter.use(authorization);

userRouter.get(
  "/followers",
  validate(followersQuerySchema, "query"),
  userController.getFollower,
);

userRouter.post(
  "/:username/friend-requests",
  validate(friendRequestParamsSchema, "params"),
  userController.sendFriendRequest,
);

userRouter.patch(
  "/friend-requests/:username/cancel",
  validate(usernameParamsSchema, "params"),
  validate(friendRequestSchema, "body"),
  userController.handleFriendRequestCancel,
);

userRouter.patch(
  "/friend-requests/:username/accept",
  validate(usernameParamsSchema, "params"),
  validate(friendRequestSchema, "body"),
  userController.handleFriendRequestAccept,
);

userRouter.get(
  "/friend-requests/received",
  userController.getReceivedFriendRequests,
);

userRouter.get("/friend-requests/sent", userController.getSentFriendRequests);

export default userRouter;
