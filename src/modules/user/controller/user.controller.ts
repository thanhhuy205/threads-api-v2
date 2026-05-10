import { AUTH_MESSAGE, USER_MESSAGE } from "@/constants/message";
import { userService } from "@/modules/user/service/user.service";
import { Request, Response } from "express";
import { NotFoundException } from "@/errors/error";
import type { UsernameParamsDto } from "../dto/request/username.params.dto";
import type { FollowersQueryDto } from "../dto/request/followers.query.dto";
import { getPagination } from "@/shared/pagination/cursor-pagination";

class UserController {
  async getFollower(req: Request<{}, {}, {}, FollowersQueryDto>, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const { after, take } = getPagination(req);
    const { followers, pagination } = await userService.getFollower({
      userId,
      after: after ?? undefined,
      take,
    });
    return res.paginate({ rows: followers, pagination });
  }

  async follower(req: Request<UsernameParamsDto>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const targetUser = await userService.findByUsername(req.params.username);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const result = await userService.follower(userId, targetUser.id);
    return res.success(200, USER_MESSAGE.FOLLOW_SUCCESS, result);
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
