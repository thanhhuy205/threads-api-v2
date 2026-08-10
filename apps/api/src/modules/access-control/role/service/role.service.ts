import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../repository/role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getRoles() {
    return this.roleRepository.findAll();
  }
  async findByName(name: string) {
    return this.roleRepository.findByName(name);
  }
}
