import prisma from "@/config/prisma";
import type { Prisma } from "@prisma/client";

class RoleRepository {
  async findByName(name: string) {
    return prisma.role.findUnique({
      where: { name },
    });
  }

  async create(data: Prisma.RoleCreateInput) {
    return prisma.role.create({
      data,
    });
  }

  async findAll() {
    return prisma.role.findMany();
  }
}

export const roleRepository = new RoleRepository();
