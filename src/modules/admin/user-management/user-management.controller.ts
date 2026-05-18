import { Request, Response } from "express";
import type { BanUserRequestDto } from "./dto/request/ban-user.request.dto";
import type { ListUsersQueryDto } from "./dto/request/list-users.query.dto";
import { userManagementService } from "./user-management.service";
import { getPagination } from "@/shared/pagination/pagination";

class UserManagementController {
  listUsers = async (
    req: Request<{}, {}, {}, ListUsersQueryDto>,
    res: Response,
  ) => {
    const { currentPage, perPage } = getPagination(req);
    const result = await userManagementService.getAllUsers({
      page: currentPage,
      limit: perPage,
    });
    return res.paginate(result);
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
