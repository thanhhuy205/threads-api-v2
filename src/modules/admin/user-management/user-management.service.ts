import { userManagementRepository } from "./user-management.repository";

class UserManagementService {
  async moderateUser(userId: string, action: "lock" | "unlock" | "temporary_ban") {
    await userManagementRepository.updateUserModeration(userId, action);

    return {
      userId,
      action,
      implemented: false,
    };
  }
}

export const userManagementService = new UserManagementService();
