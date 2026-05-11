import { roleRepository } from "../repository/role.repository";

class RoleService {
  async getRoles() {
    return roleRepository.findAll();
  }

  async createRole(name: string) {
    return roleRepository.create({ name });
  }
}

export const roleService = new RoleService();
