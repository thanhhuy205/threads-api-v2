import { baseLogger } from "@/middlewares/logger";
import { muxWebhooks } from "@/modules/webhooks/service/webhooks.service";
import { Request, Response } from "express";

class WebhooksController {
  async muxWebhook(req: Request, res: Response) {
    baseLogger.info(`Received Mux webhook: ${JSON.stringify(req.body)}`);
    const supportedEvents = [
      'video.asset.ready',
      'video.asset.errored',
      'video.asset.deleted',
    ]

    if (!supportedEvents.includes(req.body.type)) {
      return res.sendStatus(200)
    }
    const result = await muxWebhooks(req.body);
    return res.success(200, "Mux webhook received", result);
  }
}

export const webhooksController = new WebhooksController();