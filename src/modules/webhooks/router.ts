import { muxHandler } from "@/middlewares/mux";
import { webhooksController } from "@/modules/webhooks/controller/webhooks.controller";
import { Router } from 'express';

const webhooksRouter = Router();

webhooksRouter.post("/mux", muxHandler, webhooksController.muxWebhook);

export default webhooksRouter;
