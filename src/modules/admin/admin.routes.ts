import { Router } from "express";
import { adminController } from "./controller/admin.controller";

const adminRouter = Router();

adminRouter.patch("/users/:userId", (req, res) =>
  adminController.moderateUser(req, res),
);

adminRouter.patch("/reports/:reportId", (req, res) =>
  adminController.moderateReport(req, res),
);

adminRouter.get("/hashtags/trending", (req, res) =>
  adminController.listTrendingHashtags(req, res),
);

adminRouter.get("/stats", (req, res) => adminController.getStatisticsOverview(req, res));

export default adminRouter;
