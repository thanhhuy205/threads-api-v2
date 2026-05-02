import { AUTH_MESSAGE, USER_INTENT_MESSAGE } from '@/constants/message';
import { Request, Response } from 'express';
import { CreateFeedIntentDto } from '../dto/feed-intent.dto';
import { userIntentService } from '../service/user-intent.service';

class UserIntentController {
    async getFeedIntent(_req: Request, res: Response) {
        await userIntentService.getFeedIntent();
        return res.success(200, USER_INTENT_MESSAGE.RETRIEVED);
    }

    async createFeedIntent(req: Request<{}, {}, CreateFeedIntentDto>, res: Response) {
        const sub = req.user?.sub;
        if (!sub || typeof sub !== 'string') {
            return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
        }

        await userIntentService.createFeedIntent({
            sub,
            positiveText: req.body.positiveText,
            negativeText: req.body.negativeText,
        });
        return res.success(201, USER_INTENT_MESSAGE.CREATED);
    }

    async updateFeedIntent(_req: Request, res: Response) {
        await userIntentService.updateFeedIntent();
        return res.success(200, USER_INTENT_MESSAGE.UPDATED);
    }

    async deleteFeedIntent(_req: Request, res: Response) {
        await userIntentService.deleteFeedIntent();
        return res.success(200, USER_INTENT_MESSAGE.DELETED);
    }
}

export const userIntentController = new UserIntentController();
