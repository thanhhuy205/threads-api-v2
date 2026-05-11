import { AUTH_MESSAGE, USER_MESSAGE } from "@/constants/message";
import { userService } from "@/modules/user/service/user.service";
import { Request, Response } from "express";
import { NotFoundException } from "@/errors/error";
import type { UsernameParamsDto } from "../dto/request/username.params.dto";
import type { FollowersQueryDto } from "../dto/request/followers.query.dto";
import { getPagination } from "@/shared/pagination/cursor-pagination";
import { FriendRequestParamsDto } from "../dto/request/user-id.params.dto";

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

  async sendFriendRequest(req: Request<FriendRequestParamsDto>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const targetUser = await userService.findByUsername(req.params.username);
    if (!targetUser) {
      throw new NotFoundException("User not found");
    }

    const result = await userService.sendFriendRequest(userId, targetUser.id);
    return res.success(200, USER_MESSAGE.FRIEND_REQUEST_SENT, result);
  }

  async getByUsername(req: Request<UsernameParamsDto>, res: Response) {
    const user = await userService.findByUsername(req.params.username);
    if (!user) {
      return res.error(404, "User not found");
    }
    return res.success(200, "User fetched successfully", user);
  }
}

export const userController = new UserController();
