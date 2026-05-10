import { AUTH_MESSAGE, USER_MESSAGE } from "@/constants/message";
import { userService } from "@/modules/user/service/user.service";
import { Request, Response } from "express";
import { NotFoundException } from "@/errors/error";
import type { UserIdParamsDto } from "../dto/request/user-id.params.dto";
import type { UsernameParamsDto } from "../dto/request/username.params.dto";

class UserController {
  async getFollower(req: Request<UserIdParamsDto>, res: Response) {
    const followers = await userService.getFollower(req.params.id);
    return res.success(200, USER_MESSAGE.GET_FOLLOWERS_SUCCESS, followers);
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
