import { aiService } from "@/modules/ai/service/ai.service";
import { Request, Response } from "express";

class AiController {
    async generateImageCaption(req: Request, res: Response) {
        const { textNguoiDung } = req.body ?? {};
        const input = textNguoiDung;
        const sdGenerationJob = await aiService.generateImageCaption(input);
        return res.success(200, "Image generation job created", { sdGenerationJob });
    }
}

export const aiController = new AiController();
