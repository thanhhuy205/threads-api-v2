import { Injectable } from '@nestjs/common';
import { RolePermissionRepository } from '../repository/role-permission.repository';

@Injectable()
export class RolePermissionService {
  constructor(private readonly rolePermissionRepository: RolePermissionRepository) {}

  async getRolePermissions(roleId: string) {
    return this.rolePermissionRepository.findByRoleId(roleId);
  }

  async assignPermissionToRole(roleId: string, permissionId: string) {
    return this.rolePermissionRepository.assignPermission(roleId, permissionId);
  }
}
