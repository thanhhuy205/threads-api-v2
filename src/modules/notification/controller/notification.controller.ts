import type { Request, Response } from "express";

import { notificationService } from "@/modules/notification/service/notification.service";

class NotificationController {
  async welcome(req: Request, res: Response) {
    const result = await notificationService.createWelcome();
    return res.success(200, "Welcome notification sent", result);
  }

  async testNotification(req: Request, res: Response) {
    const { userId, type, data } = req.body;
    const result = await notificationService.sendRealtimeNotification(userId, type, data);
    return res.success(200, "Notification sent", result);
  }
}

export const notificationController = new NotificationController();
