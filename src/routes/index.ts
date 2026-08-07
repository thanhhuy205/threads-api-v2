import postRouter from "@/modules/post/post.routes";
import { Router } from "express";

const router = Router();
router.use("/posts", postRouter);

export default router;
