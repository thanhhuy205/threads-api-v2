import { Request, Response } from "express";
import type { TrendingHashtagQueryDto } from "./dto/request/trending-hashtag.query.dto";
import { hashtagTrendingService } from "./hashtag-trending.service";

class HashtagTrendingController {
  listTrendingHashtags = async (
    req: Request<{}, {}, {}, TrendingHashtagQueryDto>,
    res: Response,
  ) => {
    const parsedLimit = Number(req.query.limit);
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0
      ? parsedLimit
      : 10;
    const result = await hashtagTrendingService.listTrendingHashtags({ limit });

    return res.success(200, "Admin trending hashtags route ready", result);
  };
}

export const hashtagTrendingController = new HashtagTrendingController();
