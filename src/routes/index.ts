import { authorization } from "@/middlewares/auth";
import adminAuthRouter from "@/modules/admin/admin-auth.routes";
import adminRouter from "@/modules/admin/admin.routes";
import postRouter from "@/modules/post/post.routes";
import { Router } from "express";

const router = Router();
router.use("/admin", adminAuthRouter);
router.use("/admin", authorization, adminRouter);
router.use("/posts", postRouter);

export default router;
