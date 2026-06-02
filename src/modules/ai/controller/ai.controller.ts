import { aiService } from "@/modules/ai/service/ai.service";
import { Request, Response } from "express";

class AiController {
    async generateImageCaption(req: Request, res: Response) {
        const { textNguoiDung, text, content } = req.body ?? {};
        const input = textNguoiDung ?? text ?? content;
        const fileUrl = await aiService.generateImageCaption(input);
        return res.success(200, "Image generated", { fileUrl });
    }
}

export const aiController = new AiController();
