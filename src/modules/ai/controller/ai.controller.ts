import { AUTH_MESSAGE } from "@/constants/message";
import type { GenerateImageRequestDto } from "@/modules/ai/schema/ai.schema";
import { aiService } from "@/modules/ai/service/ai.service";
import { Request, Response } from "express";

class AiController {
    async generateImageCaption(req: Request<{}, {}, GenerateImageRequestDto>, res: Response) {
        const userId = req.user?.sub;

        if (!userId) {
            return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
        }

        const { content } = req.body ?? {};
        const sdGenerationJob = await aiService.generateImageCaption({
            content,
            userId,
        });
        const publicSdGenerationJob = { ...sdGenerationJob } as Record<string, unknown>;
        delete publicSdGenerationJob.apiCreditCost;
        delete publicSdGenerationJob.cost;
        console.log("AI Controller - Generated image caption", { publicSdGenerationJob });
        return res.success(200, "Image generation job created", { sdGenerationJob: publicSdGenerationJob });
    }
}

export const aiController = new AiController();
