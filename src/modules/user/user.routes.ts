import { authorization } from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";
import { Router } from "express";
import { userController } from "./controller/user.controller";
import { followersQuerySchema } from "./dto/request/followers.query.dto";
import { friendRequestSchema } from "./dto/request/friend-id.params.dto";
import { friendRequestParamsSchema } from "./dto/request/user-id.params.dto";
import { usernameParamsSchema } from "./dto/request/username.params.dto";

const userRouter = Router();

userRouter.use(authorization);

userRouter.get(
  "/followers",
  validate(followersQuerySchema, "query"),
  userController.getMyFollowers,
);

userRouter.post(
  "/:username/friend-requests",
  validate(friendRequestParamsSchema, "params"),
  userController.sendFriendRequest,
);

userRouter.patch(
  "/friend-requests/:username/cancel",
  validate(usernameParamsSchema, "params"),
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
  validate(followersQuerySchema, "query"),
  userController.getReceivedFriendRequests,
);

userRouter.get(
  "/friend-requests/sent",
  validate(followersQuerySchema, "query"),
  userController.getSentFriendRequests,
);

export default userRouter;
