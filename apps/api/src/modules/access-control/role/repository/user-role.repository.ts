import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/database/prisma.service';

@Injectable()
export class UserRoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prismaService.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
  }

  async assignRole(userId: string, roleId: string) {
    return this.prismaService.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async removeRole(userId: string, roleId: string) {
    return this.prismaService.userRole.deleteMany({
      where: {
        userId,
        roleId,
      },
    });
  }
}
