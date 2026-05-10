import { Request, Response } from "express";
import { muxWebhooks } from "@/modules/webhooks/service/webhooks.service";

class WebhooksController {
  async muxWebhook(req: Request, res: Response) {
    const result = await muxWebhooks(req.body);

    return res.success(200, "Mux webhook received", result);
  }
}

export const webhooksController = new WebhooksController();