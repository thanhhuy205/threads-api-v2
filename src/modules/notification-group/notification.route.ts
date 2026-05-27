import { authorization } from "@/middlewares/auth";
import { notificationController } from "@/modules/notification-group/controller/notification.controller";
import { Router } from "express";

const notificationRouter = Router();

notificationRouter.use(authorization);
notificationRouter.get("/", notificationController.getNotifications);
notificationRouter.get(
    "/unread",
    notificationController.getUnreadStatus,
);
notificationRouter.get(
    "/message",
    notificationController.getUnreadMessageGroups,
);
notificationRouter.get(
    "/friend-request",
    notificationController.getFriendRequestCount,
);

export default notificationRouter;
