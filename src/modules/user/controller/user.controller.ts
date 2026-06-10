import { AUTH_MESSAGE, USER_MESSAGE } from "@/constants/message";
import { NotFoundException } from "@/errors/error";
import { baseLogger } from "@/middlewares/logger";
import { jwtService } from "@/modules/jwt/service/jwt.service";
import { followerService } from "@/modules/user/service/follower.service";
import { friendService } from "@/modules/user/service/friend.service";
import { userService } from "@/modules/user/service/user.service";
import { getPagination } from "@/shared/pagination/cursor-pagination";
import { Request, Response } from "express";
import type { FollowersQueryDto } from "../dto/request/followers.query.dto";
import {
  FriendRequestDto
} from "../dto/request/friend-id.params.dto";
import type { UserNameMentionQueryDto, UsernameParamsDto } from "../dto/request/username.params.dto";

class UserController {
  async getMyFollowers(
    req: Request<{}, {}, {}, FollowersQueryDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const { after, take } = getPagination(req);
    const { users, pagination } = await followerService.getFollower({
      userId,
      after: after ?? undefined,
      take,
    });
    return res.paginate({ rows: users, pagination });
  }

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
    const { users, pagination } = await followerService.getFollower({
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
    const { users, pagination } = await followerService.getFollowing({
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

    const result = await followerService.follower(userId, targetUser.id);
    return res.success(200, USER_MESSAGE.FOLLOW_SUCCESS, result);
  }

  async sendFriendRequest(req: Request<UsernameParamsDto>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const { username } = req.params;
    const result = await friendService.sendFriendRequest(userId, username);
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
    const result = await friendService.handleFriendRequestCancel(
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
    const result = await friendService.handleFriendRequestAccept(
      userId,
      senderUsername,
      isAccept,
    );
    return res.success(200, USER_MESSAGE.FRIEND_REQUEST_PROCESSED, result);
  }

  async getByUsername(req: Request<UsernameParamsDto>, res: Response) {
    const userId = await jwtService.requestAuthToken(req);
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
    const { rows, pagination } = await friendService.getReceivedFriendRequests({
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
    const { rows, pagination } = await friendService.getSentFriendRequests({
      take: take ?? undefined,
      senderId: userId,
      receiverId: after ?? undefined,
    });
    return res.paginate({ rows, pagination });
  }

  async getUsernames(
    req: Request<{}, {}, {}, UserNameMentionQueryDto>,
    res: Response,
  ) {
    const { after, take } = getPagination(req);

    const query = req.query_parsed.q?.trim() || undefined;
    baseLogger.info(`Received request to get usernames with query "${query}", after "${after}", take ${take}`);

    const { rows, pagination } = await userService.getNetworkUsernames({
      query,
      after: after ?? undefined,
      take,
    });

    return res.paginate({ rows, pagination });
  }

  async getMyKarma(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const karma = await userService.getMyKarma(userId);
    return res.success(200, "User karma retrieved successfully", karma);
  }

  async getMyBadges(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const badges = await userService.getMyBadges(userId);
    return res.success(200, "User badges retrieved successfully", badges);
  }
}

export const userController = new UserController();
