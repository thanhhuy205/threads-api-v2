import { validate } from "@/middlewares/validate";
import { Router } from "express";
import { loginSchema } from "@/modules/auth/dto/request/login.request.dto";
import { adminAuthController } from "./auth/admin-auth.controller";

const adminAuthRouter = Router();

adminAuthRouter.post("/login", validate(loginSchema), adminAuthController.login);

export default adminAuthRouter;
