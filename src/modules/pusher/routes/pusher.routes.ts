import { authorization } from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";
import { pusherController } from "@/modules/pusher/controller/pusher.controller";
import { pusherAuthSchema } from "@/modules/pusher/dto/pusher-auth.dto";
import { Router } from "express";

const pusherRouter = Router();

pusherRouter.post(
  "/auth",
  authorization,
  validate(pusherAuthSchema),
  pusherController.authorizeChannel,
);

export default pusherRouter;
