import { Router } from "express";
import { userManagementController } from "./user-management/user-management.controller";
import { reportManagementController } from "./report-management/report-management.controller";
import { hashtagTrendingController } from "./hashtag-trending/hashtag-trending.controller";
import { statisticsController } from "./statistics/statistics.controller";
import { checkRole } from "../access-control/middleware";
import { UserRoleType } from "@prisma/client";

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

export default adminRouter;
