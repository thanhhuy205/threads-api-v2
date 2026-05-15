import { authorization } from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";
import { createMessageSchema } from "@/modules/message-group/dto/create-message.dto";
import { createMessageGroupSchema } from "@/modules/message-group/dto/create-message-group.dto";
import { messageGroupController } from "@/modules/message-group/controller/message-group.controller";
import { Router } from "express";

const messageGroupRouter = Router();

messageGroupRouter.post(
  "/",
  authorization,
  validate(createMessageGroupSchema),
  messageGroupController.createMessageGroup,
);
messageGroupRouter.get(
  "/",
  authorization,
  messageGroupController.getMessageGroups,
);
messageGroupRouter.post(
  "/:publicId/messages",
  authorization,
  validate(createMessageSchema),
  messageGroupController.sendMessage,
);
messageGroupRouter.get(
  "/:publicId/messages",
  authorization,
  messageGroupController.getMessages,
);
messageGroupRouter.get(
  "/:publicId/members",
  authorization,
  messageGroupController.getGroupMembers,
);

export default messageGroupRouter;
