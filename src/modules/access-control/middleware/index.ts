import { ForbiddenException, UnauthorizedException } from "@/errors/error";
import type { Request, Response, NextFunction } from "express";
import { permissionRepository } from "../permission/repository/permission.repository";
import { rolePermissionRepository } from "../permission/repository/role-permission.repository";
import { UserRoleType } from "@prisma/client";
import { NotFound } from "@aws-sdk/client-s3";
import { redisService } from "@/providers/redis.provider";

export const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedException("User not found");
    }

    const result = await permissionRepository.findByCode(permission);
    if (!result) {
      throw new UnauthorizedException("Permission not found");
    }

    const rolePermission = await rolePermissionRepository.findPermission(
      req.user.roles,
    );
    const permissionUnique = new Set(
      rolePermission.map((item) => item.permission.code),
    );
    const hasPermission = permissionUnique.has(permission);

    if (!hasPermission) {
      throw new ForbiddenException(
        "You don't have permission to access this resource",
      );
    }

    await redisService.set(
      `user:${req.user.id}:permission`,
      JSON.stringify(permissionUnique),
      { EX: 60 * 60 * 24 },
    );

    return next();
  };
};

export const checkRole = (role: UserRoleType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedException("User not found");
    }

    if (!req.user.roles.includes(role)) {
      throw new UnauthorizedException("Role not found");
    }

    next();
  };
};
