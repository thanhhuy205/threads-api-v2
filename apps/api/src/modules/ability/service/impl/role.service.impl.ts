import { Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY, type RoleRepository } from '../../repository/role.repository';
import type { RoleService } from '../role.service';

@Injectable()
export class RoleServiceImpl implements RoleService {
  constructor(@Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleRepository) {}

  async getRoles() {
    return this.roleRepository.findAll();
  }
  async findByName(name: string) {
    return this.roleRepository.findByName(name);
  }
}
