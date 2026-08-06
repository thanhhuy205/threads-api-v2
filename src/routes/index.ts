import { authorization } from "@/middlewares/auth";
import adminAuthRouter from "@/modules/admin/admin-auth.routes";
import adminRouter from "@/modules/admin/admin.routes";
import notificationRouter from "@/modules/notification-group/notification.route";
import pollRouter from "@/modules/poll/poll.routes";
import postRouter from "@/modules/post/post.routes";
import pusherRouter from "@/modules/pusher/routes/pusher.routes";
import searchRouter from "@/modules/search/search.routes";
import topicRouter from "@/modules/topic/topic.route";
import uploadRouter from "@/modules/upload/upload.routes";
import { Router } from "express";

const router = Router();
router.use("/admin", adminAuthRouter);
router.use("/admin", authorization, adminRouter);
router.use("/upload", uploadRouter);
router.use("/posts", postRouter);
router.use("/topic", topicRouter);
router.use("/notification", notificationRouter);
router.use("/polls", pollRouter);
router.use("/search", searchRouter);
router.use("/pusher", pusherRouter);

export default router;
