import { Request, Response } from "express";
import type { CreateTopicDto, TopicNameParamsDto } from "../dto/request/topic.request";
import { topicService } from "../service/topic.service";

class TopicController {
  async listNames(_req: Request, res: Response) {
    const topics = await topicService.listNames();
    return res.success(200, "Topics retrieved", topics);
  }

  async getByName(req: Request<TopicNameParamsDto>, res: Response) {
    const topic = await topicService.findByName(req.params.name);

    if (!topic) {
      return res.error(404, "Topic not found");
    }

    return res.success(200, "Topic retrieved", topic);
  }

  async create(req: Request<{}, {}, CreateTopicDto>, res: Response) {
    const topic = await topicService.createOrIncrement(req.body.name);
    return res.success(201, "Topic upserted", topic);
  }
}

export const topicController = new TopicController();
