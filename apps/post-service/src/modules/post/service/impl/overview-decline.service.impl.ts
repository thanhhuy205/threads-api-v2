import { PrismaService } from '@post-service/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import type { OverviewDeclineService } from '../overview-decline.service';

@Injectable()
export class OverviewDeclineServiceImpl implements OverviewDeclineService {
  constructor(private readonly prisma: PrismaService) {}

  findOneByPostId(postId: number): Promise<any> {
    return this.prisma.overviewDecline.findMany({ where: { postId } });
  }
}
