import { Request, Response } from "express";
import type { TrendingHashtagQueryDto } from "./dto/request/trending-hashtag.query.dto";
import { hashtagTrendingService } from "./hashtag-trending.service";
import { getPagination } from "@/shared/pagination/pagination";

class HashtagTrendingController {
  listTrendingHashtags = async (
    req: Request<{}, {}, {}, TrendingHashtagQueryDto>,
    res: Response,
  ) => {
    const { currentPage, perPage } = getPagination(req);
    const result = await hashtagTrendingService.listTrendingHashtags({
      page: currentPage,
      limit: perPage,
    });

    return res.paginate(result);
  };
}

export const hashtagTrendingController = new HashtagTrendingController();
