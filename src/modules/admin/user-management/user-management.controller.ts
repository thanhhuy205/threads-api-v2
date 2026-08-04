import { getPagination } from "@/shared/pagination/pagination";
import { Request, Response } from "express";
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
