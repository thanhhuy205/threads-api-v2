import { muxHandler } from "@/middlewares/mux";
import { leonardoWebhookAuth } from "@/middlewares/leonardo-webhook";
import { webhooksController } from "@/modules/webhooks/controller/webhooks.controller";
import { Router } from 'express';

const webhooksRouter = Router();

webhooksRouter.post("/mux", muxHandler, webhooksController.muxWebhook);
webhooksRouter.post("/leonardo/webhook", leonardoWebhookAuth, webhooksController.leonardoWebhook);

export default webhooksRouter;
