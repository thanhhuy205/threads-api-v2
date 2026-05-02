import { Request, Response } from 'express';
import { userIntentService } from '../service/user-intent.service';

class UserIntentController {
    async getFeedIntent(_req: Request, res: Response) {
        await userIntentService.getFeedIntent();
        return res.success(200, 'Feed intent retrieved');
    }

    async createFeedIntent(_req: Request, res: Response) {
        await userIntentService.createFeedIntent();
        return res.success(201, 'Feed intent created');
    }

    async updateFeedIntent(_req: Request, res: Response) {
        await userIntentService.updateFeedIntent();
        return res.success(200, 'Feed intent updated');
    }

    async deleteFeedIntent(_req: Request, res: Response) {
        await userIntentService.deleteFeedIntent();
        return res.success(200, 'Feed intent deleted');
    }
}

export const userIntentController = new UserIntentController();