import { Request, Response } from "express";
import type { TrendingHashtagQueryDto } from "./dto/request/trending-hashtag.query.dto";
import { hashtagTrendingService } from "./hashtag-trending.service";

class HashtagTrendingController {
  listTrendingHashtags = async (
    req: Request,
    res: Response,
  ) => {
    const { page, limit } = req.query_parsed as TrendingHashtagQueryDto;
    const result = await hashtagTrendingService.listTrendingHashtags({
      page,
      limit,
    });

    return res.success(200, "Trending hashtags retrieved successfully", result.rows, {
      pagination: result.pagination,
    });
  };
}

export const hashtagTrendingController = new HashtagTrendingController();
