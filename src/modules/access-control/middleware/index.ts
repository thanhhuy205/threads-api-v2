import { redisKey } from "@/constants/resolve-key/redis-key";
import { ForbiddenException, UnauthorizedException } from "@/errors/error";
import { redisService } from "@/providers/redis.provider";
import { UserRoleType } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { permissionRepository } from "../permission/repository/permission.repository";
import { rolePermissionRepository } from "../permission/repository/role-permission.repository";

export const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.sub;
    if (!req.user || !userId) {
      throw new UnauthorizedException("User not found");
    }
    const cacheKey = redisKey.accessControl.userPermission(userId);
    const cachedPermissions = await redisService.get(cacheKey);

    if (cachedPermissions) {
      const permissions = JSON.parse(cachedPermissions) as string[];
      if (!permissions.includes(permission)) {
        throw new ForbiddenException(
          "You don't have permission to access this resource",
        );
      }
      return next();
    }

    const result = await permissionRepository.findByCode(permission);
    if (!result) {
      throw new ForbiddenException("Permission not found");
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

    await redisService.set(cacheKey, JSON.stringify([...permissionUnique]), {
      EX: 60 * 60 * 24,
    });

    return next();
  };
};

export const checkRole = (role: UserRoleType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
    if (!req.user) {
      throw new UnauthorizedException("User not found");
    }
    console.log(req.user.roles);
    console.log(role);

    if (!req.user.roles.includes(role)) {
      throw new ForbiddenException("Role not found");
    }

    next();
  };
};
