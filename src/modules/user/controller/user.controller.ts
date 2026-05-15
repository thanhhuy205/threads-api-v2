import { AUTH_MESSAGE, USER_MESSAGE } from "@/constants/message";
import { NotFoundException } from "@/errors/error";
import { jwtService } from "@/modules/jwt/service/jwt.service";
import { userService } from "@/modules/user/service/user.service";
import { getPagination } from "@/shared/pagination/cursor-pagination";
import { Request, Response } from "express";
import type { FollowersQueryDto } from "../dto/request/followers.query.dto";
import {
  FriendRequestDto
} from "../dto/request/friend-id.params.dto";
import type { UsernameParamsDto } from "../dto/request/username.params.dto";

class UserController {
  async getFollower(
    req: Request<UsernameParamsDto, {}, {}, FollowersQueryDto>,
    res: Response,
  ) {
    const { username } = req.params;
    const user = await userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const { after, take } = getPagination(req);
    const { users, pagination } = await userService.getFollower({
      userId: user.id,
      after: after ?? undefined,
      take,
    });
    return res.paginate({ rows: users, pagination });
  }

  async getFollowing(
    req: Request<UsernameParamsDto, {}, {}, FollowersQueryDto>,
    res: Response,
  ) {
    const { username } = req.params;
    const user = await userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const { after, take } = getPagination(req);
    const { users, pagination } = await userService.getFollowing({
      userId: user.id,
      after: after ?? undefined,
      take,
    });
    return res.paginate({ rows: users, pagination });
  }

  async follower(req: Request<UsernameParamsDto>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const targetUser = await userService.findByUsername(req.params.username);
    if (!targetUser) {
      throw new NotFoundException("User not found");
    }

    const result = await userService.follower(userId, targetUser.id);
    return res.success(200, USER_MESSAGE.FOLLOW_SUCCESS, result);
  }

  async sendFriendRequest(req: Request<UsernameParamsDto>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const { username } = req.params;
    const result = await userService.sendFriendRequest(userId, username);
    return res.success(200, USER_MESSAGE.FRIEND_REQUEST_SENT, result);
  }

  async handleFriendRequestCancel(
    req: Request<UsernameParamsDto, {}, FriendRequestDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }
    const { username: receiverUsername } = req.params;
    const result = await userService.handleFriendRequestCancel(
      userId,
      receiverUsername,
    );
    return res.success(200, USER_MESSAGE.FRIEND_REQUEST_PROCESSED, result);
  }

  async handleFriendRequestAccept(
    req: Request<UsernameParamsDto, {}, FriendRequestDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }
    const { username: senderUsername } = req.params;
    const { isAccept } = req.body;
    const result = await userService.handleFriendRequestAccept(
      userId,
      senderUsername,
      isAccept,
    );
    return res.success(200, USER_MESSAGE.FRIEND_REQUEST_PROCESSED, result);
  }

  async getByUsername(req: Request<UsernameParamsDto>, res: Response) {
    const userId = await jwtService.requestAuthToken(req);
    console.log("userId", userId);
    const user = await userService.findByUsername(req.params.username, userId ?? undefined);
    if (!user) {
      return res.error(404, USER_MESSAGE.USER_NOT_FOUND);
    }
    return res.success(200, USER_MESSAGE.GET_USER_SUCCESS, user);
  }

  async getReceivedFriendRequests(
    req: Request<{}, {}, {}, FollowersQueryDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }
    const { after, take } = getPagination(req);
    const { rows, pagination } = await userService.getReceivedFriendRequests({
      take: take ?? undefined,
      receiverId: userId,
      senderId: after ?? undefined,
    });
    return res.paginate({ rows, pagination });
  }

  async getSentFriendRequests(
    req: Request<{}, {}, {}, FollowersQueryDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }
    const { after, take } = getPagination(req);
    const { rows, pagination } = await userService.getSentFriendRequests({
      take: take ?? undefined,
      senderId: userId,
      receiverId: after ?? undefined,
    });
    return res.paginate({ rows, pagination });
  }
}

export const userController = new UserController();
