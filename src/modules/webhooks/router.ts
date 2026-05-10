import { webhooksController } from "@/modules/webhooks/controller/webhooks.controller";
import { Router } from "express";

const webhooksRouter = Router();

webhooksRouter.post("/mux", webhooksController.muxWebhook);

export default webhooksRouter;
