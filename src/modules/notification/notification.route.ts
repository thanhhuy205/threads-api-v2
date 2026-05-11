import { notificationController } from "@/modules/notification/controller/notification.controller";
import { Router } from "express";
import { authorization } from "@/middlewares/auth";

const notificationRouter = Router();

notificationRouter.get("/welcome", notificationController.welcome);
notificationRouter.post("/test", authorization, notificationController.testNotification);

export default notificationRouter;
