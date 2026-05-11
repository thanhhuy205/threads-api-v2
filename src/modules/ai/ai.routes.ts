import { Router } from "express";
import { aiController } from "@/modules/ai/controller/ai.controller";
import { authorization } from "@/middlewares/auth";

const aiRouter = Router();

aiRouter.post("/moderate", authorization, aiController.moderateContent);
aiRouter.post("/caption", authorization, aiController.generateCaption);
aiRouter.post("/smart-reply", authorization, aiController.generateSmartReply);
aiRouter.get("/recommendations", authorization, aiController.recommendContent);

export default aiRouter;
