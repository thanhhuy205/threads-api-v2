import { authorization } from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";
import { messageGroupController } from "@/modules/message-group/controller/message-group.controller";
import { createMessageGroupSchema } from "@/modules/message-group/dto/create-message-group.dto";
import {
  createMessageSchema,
  updateMessageStatusSchema,
} from "@/modules/message-group/dto/create-message.dto";
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
messageGroupRouter.patch(
  "/:publicId/messages/:messagePublicId/status",
  authorization,
  validate(updateMessageStatusSchema),
  messageGroupController.updateMessageStatus,
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
