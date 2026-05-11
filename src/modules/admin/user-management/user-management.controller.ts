import { Request, Response } from "express";
import { userManagementService } from "./user-management.service";

class UserManagementController {
  listUsers = async (_req: Request, res: Response) => {
    const result = await userManagementService.getAllUsers();
    return res.success(200, "Users retrieved successfully", result);
  };

  banUser = async (req: Request<{ userId: string }>, res: Response) => {
    const result = await userManagementService.banUser(req.params.userId);
    return res.success(200, "User banned successfully", result);
  };
}

export const userManagementController = new UserManagementController();
