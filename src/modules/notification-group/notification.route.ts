import { authorization } from "@/middlewares/auth";
import { notificationController } from "@/modules/notification-group/controller/notification.controller";
import { Router } from "express";

const notificationRouter = Router();

notificationRouter.get("/", authorization, notificationController.getNotifications);

export default notificationRouter;
