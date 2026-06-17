import { UnauthorizedException } from "@/errors/error";
import { messageGroupService } from "@/modules/message-group/service/message-group.service";
import { notificationService } from "@/modules/notification-group/service/notification.service";
import { friendService } from "@/modules/user/service/friend.service";
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

  async getUnreadStatus(req: Request, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const hasUnread = await notificationService.hasUnread(userId);
    return res.success(200, "Notification unread status retrieved", {
      isNotification: hasUnread,
    });
  }

  async getUnreadMessageGroups(req: Request, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const unreadGroupCount =
      await messageGroupService.countUnreadGroupsByUserId(userId);
    return res.success(200, "Unread message groups retrieved", {
      unreadGroupCount,
    });
  }

  async getFriendRequestCount(req: Request, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const friendRequestCount =
      await friendService.countReceivedFriendRequests(userId);
    return res.success(200, "Friend request count retrieved", {
      friendRequestCount,
    });
  }

  async markAsRead(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException();
    }

    await notificationService.markGroupAsRead(userId);
    return res.success(200, "Notifications marked as read", { isRead: true });
  }
}

export const notificationController = new NotificationController();
