import { AiModule } from '@api/modules/ai/ai.module';
import { ScheduleOverviewCron } from '@work-service/cron/schedule-overview.cron';
import { PostModule } from '@post-service/modules/post/post.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), PostModule, AiModule],
  providers: [ScheduleOverviewCron],
})
export class CronModule {}
