import { validate } from "@/middlewares/validate";
import { Router } from "express";
import { topicController } from "./controller/topic.controller";
import { topicNameParamsSchema } from "./dto/request/topic.request";

const topicRouter = Router();

topicRouter.get("/:name", validate(topicNameParamsSchema, "params"), topicController.getByName);

export default topicRouter;
