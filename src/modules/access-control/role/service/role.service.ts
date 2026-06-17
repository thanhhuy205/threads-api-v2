import { roleRepository } from "../repository/role.repository";

class RoleService {
  async getRoles() {
    return roleRepository.findAll();
  }
  async findByName(name: string) {
    return roleRepository.findByName(name);
  }
}

export const roleService = new RoleService();
