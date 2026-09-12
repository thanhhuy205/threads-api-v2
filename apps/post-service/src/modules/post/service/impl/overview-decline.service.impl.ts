import { PrismaService } from '@post-service/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import type { OverviewDeclineService } from '../overview-decline.service';

@Injectable()
export class OverviewDeclineServiceImpl implements OverviewDeclineService {
  constructor(private readonly prisma: PrismaService) { }

  findOneByPostId(postId: number) {
    return this.prisma.overviewDecline.findFirst({
      where: { postId },
      orderBy: { createdAt: 'desc' },
    });
  }


}
