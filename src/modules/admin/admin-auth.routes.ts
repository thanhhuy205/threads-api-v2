import { Router } from "express";
import { validateDto } from "@/middlewares/validate-dto";
import { LoginDto } from "@/modules/auth/dto/request/login.request.dto";
import { adminAuthController } from "./auth/admin-auth.controller";

const adminAuthRouter = Router();

adminAuthRouter.post("/login", validateDto(LoginDto), adminAuthController.login);

export default adminAuthRouter;
