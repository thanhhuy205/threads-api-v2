import type { Request, Response, NextFunction } from "express";

export const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Logic to check user permission
    next();
  };
};

export const checkRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Logic to check user role
    next();
  };
};
