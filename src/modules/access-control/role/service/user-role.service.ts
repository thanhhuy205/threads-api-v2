import { userRoleRepository } from "../repository/user-role.repository";

class UserRoleService {
  async getUserRoles(userId: string) {
    return userRoleRepository.findByUserId(userId);
  }

  async assignRoleToUser(userId: string, roleId: string) {
    return userRoleRepository.assignRole(userId, roleId);
  }

  async findByUserId(userId: string) {
    return userRoleRepository.findByUserId(userId);
  }
}

export const userRoleService = new UserRoleService();
