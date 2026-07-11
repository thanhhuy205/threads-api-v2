import { aiService } from "@/modules/ai/service/ai.service";
import { Request, Response } from "express";
class CircleAiController {
    async generateMdContent(req: Request, res: Response) {
        const userId = req?.user?.sub;
        if (!userId) {
            return res.error(401, "Unauthorized");
        }
        const { content } = req.body ?? {};
        const markdown = await aiService.generateCaptionMd(userId, content);
        return res.success(200, "Markdown generated", { markdown });
    }
}


export const circleAiController = new CircleAiController();