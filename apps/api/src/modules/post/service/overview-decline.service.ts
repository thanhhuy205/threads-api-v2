import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OverviewDeclineService {
  constructor(private readonly prisma: PrismaService) {}

  findOneByPostId(postId: number) {
    return this.prisma.overviewDecline.findFirst({
      where: { postId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
