import { getPagination } from "@/shared/pagination/pagination";
import { Request, Response } from "express";
import type { BanUserRequestDto } from "./dto/request/ban-user.request.dto";
import type { ListUsersQueryDto } from "./dto/request/list-users.query.dto";
import { userManagementService } from "./user-management.service";

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
    return res.success(200, "Users retrieved successfully", result.rows, {
      pagination: result.pagination,
    });
  };

  banUser = async (
    req: Request<{ userId: string }, {}, BanUserRequestDto>,
    res: Response,
  ) => {
    const result = await userManagementService.banUser({
      userId: req.params.userId,
      adminId: req.user?.sub,
      durationHours: req.body.durationHours,
    });
    return res.success(200, "User banned successfully", result);
  };

  unbanUser = async (req: Request<{ userId: string }, {}, {}>, res: Response) => {
    const result = await userManagementService.unbanUser({
      userId: req.params.userId,
      adminId: req.user?.sub,
    });
    return res.success(200, "User unbanned successfully", result);
  };

  banUserUnlimited = async (
    req: Request<{ userId: string }, {}, {}>,
    res: Response
  ) => {
    const result = await userManagementService.banUserUnlimited({
      userId: req.params.userId,
      adminId: req.user?.sub
    });
    return res.success(200, "User banned indefinitely successfully", result);
  }
}

export const userManagementController = new UserManagementController();
