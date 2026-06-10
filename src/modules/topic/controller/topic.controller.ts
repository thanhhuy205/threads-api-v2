import { getPagination } from "@/shared/pagination/cursor-pagination";
import { Request, Response } from "express";
import type { CreateTopicDto, SearchTopicQueryDto } from "../dto/request/topic.request";
import { topicService } from "../service/topic.service";

class TopicController {
  async getByName(req: Request<{}, {}, {}, SearchTopicQueryDto>, res: Response) {
    const { after, take } = getPagination(req);
    const { q } = req.query;
    const { rows, pagination } = await topicService.searchByName({
      q,
      take,
      after: after ?? undefined,
    });

    return res.paginate({ rows, pagination });
  }

  async create(req: Request<{}, {}, CreateTopicDto>, res: Response) {
    const topic = await topicService.createOrIncrement(req.body.name);
    return res.success(201, "Topic upserted", topic);
  }
}

export const topicController = new TopicController();
