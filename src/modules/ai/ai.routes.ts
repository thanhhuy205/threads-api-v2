import { aiController } from "@/modules/ai/controller/ai.controller";
import { Router } from "express";

const aiRouter = Router();

// aiRouter.use(authorization);
aiRouter.post("/generate-image", aiController.generateImageCaption);

export default aiRouter;
