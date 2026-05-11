import prisma from "@/config/prisma";
import type { Prisma } from "@prisma/client";

class PermissionRepository {
  async findByCode(code: string) {
    return prisma.permission.findUnique({
      where: { code },
    });
  }

  async create(data: Prisma.PermissionCreateInput) {
    return prisma.permission.create({
      data,
    });
  }

  async findAll() {
    return prisma.permission.findMany();
  }
}

export const permissionRepository = new PermissionRepository();
