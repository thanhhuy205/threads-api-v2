import { validate } from "@/middlewares/validate";
import { Router } from "express";
import { topicController } from "./controller/topic.controller";
import { createTopicSchema, topicNameParamsSchema } from "./dto/request/topic.request";

const topicRouter = Router();

topicRouter.get("/", topicController.listNames);
topicRouter.post("/", validate(createTopicSchema), topicController.create);
topicRouter.get("/:name", validate(topicNameParamsSchema, "params"), topicController.getByName);

export default topicRouter;
