import { AUTH_MESSAGE } from "@/constants/message";
import type { Request, Response } from "express";
import type { LoginDto } from "@/modules/auth/dto/request/login.request.dto";
import { adminAuthService } from "./admin-auth.service";

class AdminAuthController {
  async login(req: Request<{}, {}, LoginDto>, res: Response) {
    const user = await adminAuthService.login(req.body, {
      ip: req.ip ?? "unknown",
      userAgent: req.headers["user-agent"]?.toString() ?? "unknown",
    });

    if (!user) {
      return res.error(401, AUTH_MESSAGE.INVALID_CREDENTIALS);
    }

    return res.success(200, AUTH_MESSAGE.LOGIN_SUCCESS, user);
  }
}

export const adminAuthController = new AdminAuthController();
