import { Injectable } from '@nestjs/common';
import { PermissionRepository } from '../repository/permission.repository';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) { }

  async getPermissions() {
    return this.permissionRepository.findAll();
  }


}
