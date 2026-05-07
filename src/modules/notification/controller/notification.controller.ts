import type { Request, Response } from "express";

import { notificationService } from "@/modules/notification/service/notification.service";

class NotificationController {
  async welcome(req: Request, res: Response) {
    const result = await notificationService.createWelcome();
    return res.success(200, "Welcome notification sent", result);
  }
}

export const notificationController = new NotificationController();
