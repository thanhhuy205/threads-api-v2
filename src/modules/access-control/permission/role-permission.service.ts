import { rolePermissionRepository } from "./role-permission.repository";

class RolePermissionService {
  async getRolePermissions(roleId: string) {
    return rolePermissionRepository.findByRoleId(roleId);
  }

  async assignPermissionToRole(roleId: string, permissionId: string) {
    return rolePermissionRepository.assignPermission(roleId, permissionId);
  }
}

export const rolePermissionService = new RolePermissionService();
