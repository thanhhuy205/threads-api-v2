import { permissionRepository } from "../repository/permission.repository";

class PermissionService {
  async getPermissions() {
    return permissionRepository.findAll();
  }

  async createPermission(name: string, code: string) {
    return permissionRepository.create({ name, code });
  }
}

export const permissionService = new PermissionService();
