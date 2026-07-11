import { Request, Response } from "express";
import type { CreateTopicDto, SearchTopicQueryDto } from "../dto/request/topic.request";
import { topicService } from "../service/topic.service";

class TopicController {
  async getByName(req: Request<{}, {}, {}, SearchTopicQueryDto>, res: Response) {
    const { q } = req.query;
    const result = await topicService.searchByName(q);
    return res.success(200, "Topics retrieved successfully", result);
  }

  async create(req: Request<{}, {}, CreateTopicDto>, res: Response) {
    const topic = await topicService.createOrIncrement(req.body.name);
    return res.success(201, "Topic upserted", topic);
  }
}

export const topicController = new TopicController();
