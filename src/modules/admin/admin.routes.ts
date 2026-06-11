import { validate } from "@/middlewares/validate";
import { UserRoleType } from "@prisma/client";
import { Router } from "express";
import { checkRole } from "../access-control/middleware";
import { dailyQuestController } from "./daily-quest/daily-quest.controller";
import { createDailyQuestRequestSchema } from "./daily-quest/dto/request/create-daily-quest.request.dto";
import { disableDailyQuestParamsSchema } from "./daily-quest/dto/request/disable-daily-quest.params.dto";
import { trendingHashtagQuerySchema } from "./hashtag-trending/dto/request/trending-hashtag.query.dto";
import { hashtagTrendingController } from "./hashtag-trending/hashtag-trending.controller";
import { listReportsQuerySchema } from "./report-management/dto/request/list-reports.query.dto";
import { moderateReportRequestSchema } from "./report-management/dto/request/moderate-report.request.dto";
import { reportManagementController } from "./report-management/report-management.controller";
import { adminStatsQuerySchema } from "./statistics/dto/request/admin-stats.query.dto";
import { statisticsController } from "./statistics/statistics.controller";
import { banUserRequestSchema } from "./user-management/dto/request/ban-user.request.dto";
import { userManagementController } from "./user-management/user-management.controller";

const adminRouter = Router();

adminRouter.get(
  "/users",
  checkRole(UserRoleType.ADMIN),
  userManagementController.listUsers,
);
adminRouter.patch(
  "/users/:userId/ban",
  checkRole(UserRoleType.ADMIN),
  validate(banUserRequestSchema),
  userManagementController.banUser,
);

adminRouter.patch(
  "/users/:userId/unban",
  checkRole(UserRoleType.ADMIN),
  userManagementController.unbanUser,
);

adminRouter.patch(
  "/users/:userId/ban-unlimited",
  checkRole(UserRoleType.ADMIN),
  userManagementController.banUserUnlimited,
);


adminRouter.get(
  "/reports",
  checkRole(UserRoleType.ADMIN),
  validate(listReportsQuerySchema, "query"),
  reportManagementController.listReports,
);

adminRouter.get(
  "/reports/:reportId",
  checkRole(UserRoleType.ADMIN),
  reportManagementController.getReportDetails,
);


adminRouter.patch(
  "/reports/:reportId",
  checkRole(UserRoleType.ADMIN),
  validate(moderateReportRequestSchema),
  reportManagementController.moderateReport,
);

adminRouter.get(
  "/hashtags/trending",
  checkRole(UserRoleType.ADMIN),
  validate(trendingHashtagQuerySchema, "query"),
  hashtagTrendingController.listTrendingHashtags,
);

adminRouter.get(
  "/stats",
  checkRole(UserRoleType.ADMIN),
  validate(adminStatsQuerySchema, "query"),
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
