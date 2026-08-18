import { AiModule } from '@api/modules/ai/ai.module';
import { ScheduleOverviewCron } from '@api/modules/cron/schedule-overview.cron';
import { PostModule } from '@api/modules/post/post.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), PostModule, AiModule],
  providers: [ScheduleOverviewCron],
})
export class CronModule {}
