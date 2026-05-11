import type { Request, Response } from "express";
import { aiService } from "@/modules/ai/service/ai.service";

class AiController {
  async moderateContent(req: Request, res: Response) {
    const { content } = req.body;
    const result = await aiService.moderateContent(content);
    return res.success(200, "Content moderated", result);
  }

  async generateCaption(req: Request, res: Response) {
    const { imageUrl } = req.body;
    const result = await aiService.generateCaption(imageUrl);
    return res.success(200, "Caption generated", result);
  }

  async generateSmartReply(req: Request, res: Response) {
    const { context } = req.body;
    const result = await aiService.generateSmartReply(context);
    return res.success(200, "Smart replies generated", result);
  }

  async recommendContent(req: Request, res: Response) {
    const userId = req.user?.id as string;
    const result = await aiService.recommendContent(userId);
    return res.success(200, "Recommendations generated", result);
  }
}

export const aiController = new AiController();
