import { aiService } from "@/modules/ai/service/ai.service";
import { Request, Response } from "express";
class CircleAiController {
    async generateMdContent(req: Request, res: Response) {
        const { textNguoiDung, text, content } = req.body ?? {};
        const input = textNguoiDung ?? text ?? content;
        const markdown = await aiService.generateCaptionMd(input);
        return res.success(200, "Markdown generated", { markdown });
    }
}


export const circleAiController = new CircleAiController();