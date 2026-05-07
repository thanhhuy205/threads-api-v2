import { notificationController } from "@/modules/notification/controller/notification.controller";
import { Router } from "express";

const notificationRouter = Router();

notificationRouter.get("/welcome", notificationController.welcome);

export default notificationRouter;
