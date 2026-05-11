import { Router } from "express";
import { searchController } from "@/modules/search/controller/search.controller";
import { authorization } from "@/middlewares/auth";

const searchRouter = Router();

searchRouter.get("/", authorization, searchController.search);

export default searchRouter;
