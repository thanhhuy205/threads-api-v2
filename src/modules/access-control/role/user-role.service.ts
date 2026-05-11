import { userRoleRepository } from "./user-role.repository";

class UserRoleService {
  async getUserRoles(userId: string) {
    return userRoleRepository.findByUserId(userId);
  }

  async assignRoleToUser(userId: string, roleId: string) {
    return userRoleRepository.assignRole(userId, roleId);
  }
}

export const userRoleService = new UserRoleService();
