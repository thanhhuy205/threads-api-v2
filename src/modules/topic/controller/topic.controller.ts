import { Request, Response } from "express";
import type { TopicNameParamsDto } from "../dto/request/topic.request";
import { topicService } from "../service/topic.service";

class TopicController {
  async getByName(req: Request<TopicNameParamsDto>, res: Response) {
    const topic = await topicService.findByName(req.params.name);

    if (!topic) {
      return res.error(404, "Topic not found");
    }

    return res.success(200, "Topic retrieved", topic);
  }
}

export const topicController = new TopicController();
