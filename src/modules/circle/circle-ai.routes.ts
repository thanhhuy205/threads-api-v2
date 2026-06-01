import { authorization } from "@/middlewares/auth";
import { circleAiController } from "@/modules/circle/controller/circle-ai.controller";
import { Router } from "express";

const circleAIRouter = Router();

circleAIRouter.use(authorization);
circleAIRouter.post('/generate-response', circleAiController.generateMdContent);