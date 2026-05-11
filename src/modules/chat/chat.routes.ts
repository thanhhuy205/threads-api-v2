import { Router } from "express";
import { chatController } from "@/modules/chat/controller/chat.controller";
import { authorization } from "@/middlewares/auth";

const chatRouter = Router();

chatRouter.post("/message", authorization, chatController.sendMessage);
chatRouter.patch("/message/:messageId/seen", authorization, chatController.markAsSeen);

export default chatRouter;
