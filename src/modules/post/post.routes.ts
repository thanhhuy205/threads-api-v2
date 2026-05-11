import { authorization } from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";
import { Router } from "express";
import { postController } from "./controller/post.controller";
import { createPostSchema, updatePostSchema } from "./dto/post.dto";
import {
  cursorPaginationQuerySchema,
  newsFeedQuerySchema,
  publicIdParamsSchema,
  reportSchema,
  usernameParamsSchema,
} from "./dto/request/post.request";

const postRouter = Router();

postRouter.get(
  "/news-feed",
  validate(newsFeedQuerySchema, "query"),
  postController.getNewsFeedController,
);
postRouter.get("/search", postController.search);
postRouter.get(
  "/:publicId/replies",
  validate(publicIdParamsSchema, "params"),
  validate(cursorPaginationQuerySchema, "query"),
  postController.getReplies,
);
postRouter.get(
  "/:publicId",
  validate(publicIdParamsSchema, "params"),
  postController.getPost,
);
postRouter.get(
  "/user/:username",
  validate(usernameParamsSchema, "params"),
  validate(cursorPaginationQuerySchema, "query"),
  postController.getPostsByUser,
);
postRouter.get(
  "/user/:username/replies",
  validate(usernameParamsSchema, "params"),
  validate(cursorPaginationQuerySchema, "query"),
  postController.getRepliesByUser,
);
postRouter.get(
  "/user/:username/quotes",
  validate(usernameParamsSchema, "params"),
  validate(cursorPaginationQuerySchema, "query"),
  postController.getQuote,
);

postRouter.use(authorization);

postRouter.get(
  "/me",
  validate(cursorPaginationQuerySchema, "query"),
  postController.getPostMe,
);
postRouter.get(
  "/me/replies",
  validate(cursorPaginationQuerySchema, "query"),
  postController.getRepliesMe,
);
postRouter.get(
  "/me/quote",
  validate(cursorPaginationQuerySchema, "query"),
  postController.getQuoteMe,
);

postRouter.post(
  "/",
  validate(createPostSchema),
  postController.createPostController,
);

postRouter.post(
  "/:publicId/reply",
  validate(publicIdParamsSchema, "params"),
  validate(createPostSchema),
  postController.replyPost,
);
postRouter.post(
  "/:publicId/like",
  validate(publicIdParamsSchema, "params"),
  postController.likePost,
);
postRouter.post(
  "/:publicId/repost",
  validate(publicIdParamsSchema, "params"),
  postController.repostPost,
);
postRouter.post(
  "/:publicId/quote",
  validate(publicIdParamsSchema, "params"),
  validate(createPostSchema),
  postController.quotePost,
);
postRouter.post(
  "/:publicId/save",
  validate(publicIdParamsSchema, "params"),
  postController.savePost,
);
postRouter.post(
  "/:publicId/hide",
  validate(publicIdParamsSchema, "params"),
  postController.hidePost,
);
postRouter.post(
  "/:publicId/report",
  validate(publicIdParamsSchema, "params"),
  validate(reportSchema),
  postController.reportPost,
);
postRouter.patch(
  "/:publicId",
  validate(publicIdParamsSchema, "params"),
  validate(updatePostSchema),
  postController.updatePost,
);
postRouter.delete(
  "/:publicId",
  validate(publicIdParamsSchema, "params"),
  postController.deletePost,
);

export default postRouter;
