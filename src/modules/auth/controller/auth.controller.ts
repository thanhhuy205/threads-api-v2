import configService from "@/config/config";
import { AUTH_MESSAGE } from "@/constants/message";
import { authService } from "@/modules/auth/service/auth.service";
import { Request, Response } from "express";
import type { ForgotPasswordDto } from "../dto/request/forgot-password.request.dto";
import type { LoginDto } from "../dto/request/login.request.dto";
import type { RegisterDto } from "../dto/request/register.request.dto";
import type { ResetPasswordDto } from "../dto/request/reset-password.request.dto";
import type { UpdateProfileDto } from "../dto/request/update-profile.request.dto";
import type { ValidateEmailDto } from "../dto/request/validate-email.request.dto";
import type { ValidateTokenDto } from "../dto/request/validate-token.request.dto";
import type { ValidateUsernameDto } from "../dto/request/validate-username.request.dto";

class AuthController {
  async register(req: Request<{}, {}, RegisterDto>, res: Response) {
    const user = await authService.register(req.body, {
      ip: req.ip ?? "unknown",
      userAgent: req.headers["user-agent"]?.toString() ?? "unknown",
    });
    return res.success(201, AUTH_MESSAGE.REGISTER_SUCCESS, user);
  }

  async login(req: Request<{}, {}, LoginDto>, res: Response) {
    const user = await authService.login(req.body, {
      ip: req.ip ?? "unknown",
      userAgent: req.headers["user-agent"]?.toString() ?? "unknown",
    });

    if (!user) {
      return res.error(401, AUTH_MESSAGE.INVALID_CREDENTIALS);
    }
    return res.success(200, AUTH_MESSAGE.LOGIN_SUCCESS, user);
  }

  async forgotPassword(req: Request<{}, {}, ForgotPasswordDto>, res: Response) {
    const result = await authService.forgotPassword(req.body);
    return res.success(200, AUTH_MESSAGE.FORGOT_PASSWORD_SUCCESS, result);
  }

  async updateProfile(req: Request<{}, {}, UpdateProfileDto>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const result = await authService.updateProfile(userId, req.body);
    return res.success(200, AUTH_MESSAGE.UPDATE_USER_SUCCESS, result);
  }

  async refreshToken(req: Request<{}, {}, {}>, res: Response) {
    if (!req.refreshToken) {
      return res.error(400, AUTH_MESSAGE.INVALID_CREDENTIALS);
    }    const tokenPair = await authService.refreshToken({ refreshToken: req.refreshToken }, {
      ip: req.ip ?? "unknown",
      userAgent: req.headers["user-agent"]?.toString() ?? "unknown",
    });
    if (!tokenPair) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }    return res.success(200, AUTH_MESSAGE.REFRESH_TOKEN_SUCCESS, tokenPair);
  }

  async resendVerifyEmail(req: Request, res: Response) {
    if (!req.user?.sub) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }
    const originUrl = req.headers['x-origin-url'] ?? configService.FRONTEND_URL;
    await authService.resendVerifyEmail(originUrl.toString(), req.user?.sub);
    return res.success(200, AUTH_MESSAGE.RESEND_VERIFY_EMAIL_SUCCESS);
  }

  async verifyEmail(req: Request<{}, {}, ValidateTokenDto>, res: Response) {
    await authService.verifyEmail(req.body);
    return res.success(200, AUTH_MESSAGE.VERIFY_EMAIL_SUCCESS);
  }

  async validateEmail(req: Request<{}, {}, ValidateEmailDto>, res: Response) {
    const result = await authService.validateEmail(req.body);
    return res.success(200, AUTH_MESSAGE.VALIDATE_EMAIL_SUCCESS, result);
  }

  async validateUsername(
    req: Request<{}, {}, ValidateUsernameDto>,
    res: Response,
  ) {
    const result = await authService.validateUsername(req.body);
    return res.success(200, AUTH_MESSAGE.VALIDATE_USERNAME_SUCCESS, result);
  }

  async validateResetPasswordToken(req: Request, res: Response) {
    const query = req.query_parsed as ValidateTokenDto;
    const result = await authService.validateResetPasswordToken(query.token);
    return res.success(
      200,
      AUTH_MESSAGE.VALIDATE_RESET_PASSWORD_TOKEN_SUCCESS,
      result,
    );
  }

  async resetPassword(req: Request<{}, {}, ResetPasswordDto>, res: Response) {
    await authService.resetPassword(req.body);
    return res.success(200, AUTH_MESSAGE.RESET_PASSWORD_SUCCESS);
  }

  async me(req: Request, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const user = await authService.me(userId);

    if (!user) {
      return res.error(404, AUTH_MESSAGE.USER_NOT_FOUND);
    }

    return res.success(200, AUTH_MESSAGE.GET_ME_SUCCESS, user);
  }

  async logout(req: Request<{}, {}, {}>, res: Response) {
    const accessToken = req.accessToken as string;
    const refreshToken = req.refreshToken as string;
    await authService.logout(accessToken, {
      refreshToken,
    });
    return res.success(200, AUTH_MESSAGE.LOGOUT_SUCCESS);
  }
}


export const authController = new AuthController();