import { AUTH_MESSAGE, USER_MESSAGE } from '@/constants/message';
import { userService } from '@/modules/user/service/user.service';
import { Request, Response } from 'express';
import type { UserIdParamsDto } from '../dto/request/user-id.params.dto';

class UserController {
    async getFollower(req: Request<UserIdParamsDto>, res: Response) {
        const followers = await userService.getFollower(req.params.id);
        return res.success(200, USER_MESSAGE.GET_FOLLOWERS_SUCCESS, followers);
    }

    async followUser(req: Request<UserIdParamsDto>, res: Response) {
        const userId = req.user?.sub;

        if (!userId) {
            return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
        }

        const result = await userService.followUser(userId, req.params.id);
        return res.success(200, USER_MESSAGE.FOLLOW_SUCCESS, result);
    }

    async unFollowUser(req: Request<UserIdParamsDto>, res: Response) {
        const userId = req.user?.sub;

        if (!userId) {
            return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
        }

        const result = await userService.unFollowUser(userId, req.params.id);
        return res.success(200, USER_MESSAGE.UNFOLLOW_SUCCESS, result);
    }
}

export const userController = new UserController();