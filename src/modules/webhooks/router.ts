import { hookHlsHandler } from "@/middlewares/hook-hls";
import { leonardoWebhookAuth } from "@/middlewares/leonardo-webhook";
import { webhooksController } from "@/modules/webhooks/controller/webhooks.controller";
import { Router } from 'express';

const webhooksRouter = Router();

webhooksRouter.post("/hls", hookHlsHandler, webhooksController.hookHls);
webhooksRouter.post("/leonardo", leonardoWebhookAuth, webhooksController.leonardoWebhook);

export default webhooksRouter;
