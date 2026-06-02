import { authorization } from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";
import { aiController } from "@/modules/ai/controller/ai.controller";
import { generateImageRequestSchema } from "@/modules/ai/schema/ai.schema";
import { Router } from "express";

const aiRouter = Router();

aiRouter.use(authorization);
aiRouter.post(
    "/generate-image",
    validate(generateImageRequestSchema),
    aiController.generateImageCaption,
);

export default aiRouter;
