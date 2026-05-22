import { authorization } from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";
import { searchController } from "@/modules/search/controller/search.controller";
import {
  searchPostsQuerySchema,
  searchTopicQuerySchema,
  searchUsernameQuerySchema,
} from "@/modules/search/dto/search.dto";
import { Router } from "express";

const searchRouter = Router();

searchRouter.get(
  "/posts",
  authorization,
  validate(searchPostsQuerySchema, "query"),
  searchController.searchPost,
);
searchRouter.get(
  "/username",
  authorization,
  validate(searchUsernameQuerySchema, "query"),
  searchController.searchUsername,
);
searchRouter.get(
  "/topic",
  authorization,
  validate(searchTopicQuerySchema, "query"),
  searchController.searchTopic,
);

export default searchRouter;
