import { AUTH_MESSAGE } from '@/constants/message';
import { notificationService } from '@/modules/notification/service/notification.service';
import type { Request, Response } from 'express';

class NotificationController {
    async welcome(req: Request, res: Response) {
        const userId = req.user?.sub;

        if (!userId) {
            return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
        }

        const result = await notificationService.createWelcome(userId);
        return res.success(200, 'Welcome notification sent', result);
    }
}

export const notificationController = new NotificationController();
