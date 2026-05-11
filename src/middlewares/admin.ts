import { AUTH_MESSAGE, COMMON_MESSAGE } from "@/constants/message";
import { ForbiddenException, UnauthorizedException } from "@/errors/error";
import { userRepository } from "@/modules/user/repository/user.repository";
import { UserRoleType } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const adminHandler = async (req: Request, _res: Response, next: NextFunction) => {
  const userId = req.user?.sub;

  if (!userId) {
    throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
  }

  if (!req.user?.roles.includes(UserRoleType.ADMIN)) {
    throw new ForbiddenException(COMMON_MESSAGE.UNAUTHORIZED);
  }

  return next();
};
