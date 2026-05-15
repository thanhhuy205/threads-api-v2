import { Request, Response } from "express";
import type { BanUserRequestDto } from "./dto/request/ban-user.request.dto";
import { userManagementService } from "./user-management.service";

class UserManagementController {
  listUsers = async (_req: Request, res: Response) => {
    const result = await userManagementService.getAllUsers();
    return res.success(200, "Users retrieved successfully", result);
  };

  banUser = async (
    req: Request<{ userId: string }, {}, BanUserRequestDto>,
    res: Response,
  ) => {
    const result = await userManagementService.banUser({
      userId: req.params.userId,
      adminId: req.user?.sub,
      bannedUntil: req.body?.bannedUntil
        ? new Date(req.body.bannedUntil)
        : undefined,
      durationHours: req.body?.durationHours,
    });
    return res.success(200, "User banned successfully", result);
  };
}

export const userManagementController = new UserManagementController();
