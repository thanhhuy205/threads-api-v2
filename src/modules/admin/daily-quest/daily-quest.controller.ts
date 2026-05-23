import { UnauthorizedException } from "@/errors/error";
import { getPagination } from "@/shared/pagination/pagination";
import { Request, Response } from "express";
import type { CreateDailyQuestRequestDto } from "./dto/request/create-daily-quest.request.dto";
import type { DisableDailyQuestParamsDto } from "./dto/request/disable-daily-quest.params.dto";
import type { ListDailyQuestsQueryDto } from "./dto/request/list-daily-quests.query.dto";
import { dailyQuestService } from "./daily-quest.service";

class DailyQuestController {
  createDailyQuest = async (
    req: Request<{}, {}, CreateDailyQuestRequestDto>,
    res: Response,
  ) => {
    const adminId = req.user?.sub;
    if (!adminId) {
      throw new UnauthorizedException("User not found");
    }

    const result = await dailyQuestService.createDailyQuest({
      ...req.body,
      createById: adminId,
    });

    return res.success(201, "Daily quest created successfully", result);
  };

  listDailyQuests = async (
    req: Request<{}, {}, {}, ListDailyQuestsQueryDto>,
    res: Response,
  ) => {
    const { currentPage, perPage } = getPagination(req);
    const result = await dailyQuestService.getDailyQuests({
      page: currentPage,
      limit: perPage,
    });

    return res.success(200, "Daily quests retrieved successfully", result.rows, {
      pagination: result.pagination,
    });
  };

  disableDailyQuest = async (
    req: Request<DisableDailyQuestParamsDto>,
    res: Response,
  ) => {
    const result = await dailyQuestService.disableDailyQuest({
      id: req.params.id,
    });

    return res.success(200, "Daily quest disabled successfully", result);
  };
}

export const dailyQuestController = new DailyQuestController();
