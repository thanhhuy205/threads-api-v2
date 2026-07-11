import prisma from "@/config/prisma";

class RoleRepository {
  async findAll() {
    return prisma.role.findMany();
  }
  async findByName(name: string) {
    return prisma.role.findUnique({
      where: { name },
    });
  }
}

export const roleRepository = new RoleRepository();
