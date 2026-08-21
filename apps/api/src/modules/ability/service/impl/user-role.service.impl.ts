import { Inject, Injectable } from '@nestjs/common';
import { USER_ROLE_REPOSITORY, type UserRoleRepository } from '../../repository/user-role.repository';
import type { UserRoleService } from '../user-role.service';

@Injectable()
export class UserRoleServiceImpl implements UserRoleService {
  constructor(@Inject(USER_ROLE_REPOSITORY) private readonly userRoleRepository: UserRoleRepository) {}

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
