import { Injectable } from '@nestjs/common';
import { UserRoleRepository } from '../repository/user-role.repository';

@Injectable()
export class UserRoleService {
  constructor(private readonly userRoleRepository: UserRoleRepository) {}

  async getUserRoles(userId: string) {
    return this.userRoleRepository.findByUserId(userId);
  }

  async assignRoleToUser(userId: string, roleId: string) {
    return this.userRoleRepository.assignRole(userId, roleId);
  }

  async findByUserId(userId: string) {
    return this.userRoleRepository.findByUserId(userId);
  }
}
