import { UnauthorizedException } from "@/errors/error";
import { notificationService } from "@/modules/notification-group/service/notification.service";
import { getPagination } from "@/shared/pagination/cursor-pagination";
import type { Request, Response } from "express";

class NotificationController {
  async getNotifications(req: Request, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const { after, take } = getPagination(req);
    const notifications = await notificationService.findAll({
      recipientId: userId,
      after: after ?? undefined,
      take,
    });

    return res.paginate(notifications);
  }
}

export const notificationController = new NotificationController();
