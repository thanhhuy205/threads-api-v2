import { UnauthorizedException } from "@/errors/error";
import type { Request, Response, NextFunction } from "express";
import { permissionRepository } from "../permission/repository/permission.repository";
import { rolePermissionRepository } from "../permission/repository/role-permission.repository";

export const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedException("User not found");
    }

    const result = await permissionRepository.findByCode(permission);
    if (!result) {
      throw new UnauthorizedException("Permission not found");
    }

    const rolePermission = await rolePermissionRepository.findRoleAndPermission(
      req.user.roleId,
      result.id,
    );
    if (!rolePermission) {
      throw new UnauthorizedException("Permission not found");
    }
    next();
  };
};

export const checkRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Logic to check user role
    next();
  };
};
