import { getPagination } from "@/shared/pagination/cursor-pagination";
import { Request, Response } from "express";
import type { CreateTopicDto, SearchTopicQueryDto } from "../dto/request/topic.request";
import { topicService } from "../service/topic.service";

class TopicController {
  async listNames(_req: Request, res: Response) {
    const topics = await topicService.listNames();
    return res.success(200, "Topics retrieved", topics);
  }
  // nên có id để tối ưu
  async getByName(req: Request<{}, {}, {}, SearchTopicQueryDto>, res: Response) {
    const { after, take } = getPagination(req);
    const { q } = req.query;
    const topic = await topicService.searchByName({
      q,
      take,
      after: after ?? undefined,
    });

    if (!topic) {
      return res.error(404, "Topic not found");
    }

    return res.paginate({ rows: topic, pagination: topic.pagination });
  }

  async create(req: Request<{}, {}, CreateTopicDto>, res: Response) {
    const topic = await topicService.createOrIncrement(req.body.name);
    return res.success(201, "Topic upserted", topic);
  }
}

export const topicController = new TopicController();
