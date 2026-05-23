import { Router } from "express";
import { userManagementController } from "./user-management/user-management.controller";
import { reportManagementController } from "./report-management/report-management.controller";
import { hashtagTrendingController } from "./hashtag-trending/hashtag-trending.controller";
import { statisticsController } from "./statistics/statistics.controller";
import { checkRole } from "../access-control/middleware";
import { UserRoleType } from "@prisma/client";
import { dailyQuestController } from "./daily-quest/daily-quest.controller";
import { validate } from "@/middlewares/validate";
import { createDailyQuestRequestSchema } from "./daily-quest/dto/request/create-daily-quest.request.dto";
import { disableDailyQuestParamsSchema } from "./daily-quest/dto/request/disable-daily-quest.params.dto";
import { listReportsQuerySchema } from "./report-management/dto/request/list-reports.query.dto";

const adminRouter = Router();

adminRouter.get(
  "/users",
  checkRole(UserRoleType.ADMIN),
  userManagementController.listUsers,
);
adminRouter.patch(
  "/users/:userId/ban",
  checkRole(UserRoleType.ADMIN),
  userManagementController.banUser,
);

adminRouter.get(
  "/reports",
  checkRole(UserRoleType.ADMIN),
  validate(listReportsQuerySchema, "query"),
  reportManagementController.listReports,
);

adminRouter.patch(
  "/reports/:reportId",
  checkRole(UserRoleType.ADMIN),
  reportManagementController.moderateReport,
);

adminRouter.get(
  "/hashtags/trending",
  checkRole(UserRoleType.ADMIN),
  hashtagTrendingController.listTrendingHashtags,
);

adminRouter.get(
  "/stats",
  checkRole(UserRoleType.ADMIN),
  statisticsController.getOverview,
);

adminRouter.post(
  "/daily-quests",
  checkRole(UserRoleType.ADMIN),
  validate(createDailyQuestRequestSchema),
  dailyQuestController.createDailyQuest,
);

adminRouter.get(
  "/daily-quests/actions",
  checkRole(UserRoleType.ADMIN),
  dailyQuestController.listDailyQuestActions,
);

adminRouter.get(
  "/daily-quests",
  checkRole(UserRoleType.ADMIN),
  dailyQuestController.listDailyQuests,
);

adminRouter.patch(
  "/daily-quests/:code/disable",
  checkRole(UserRoleType.ADMIN),
  validate(disableDailyQuestParamsSchema, "params"),
  dailyQuestController.disableDailyQuest,
);

export default adminRouter;
