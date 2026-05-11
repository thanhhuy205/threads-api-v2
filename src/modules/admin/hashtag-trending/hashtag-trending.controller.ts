import { Request, Response } from "express";
import { hashtagTrendingService } from "./hashtag-trending.service";

class HashtagTrendingController {
  listTrendingHashtags = async (_req: Request, res: Response) => {
    const result = await hashtagTrendingService.listTrendingHashtags();

    return res.success(200, "Admin trending hashtags route ready", result);
  };
}

export const hashtagTrendingController = new HashtagTrendingController();
