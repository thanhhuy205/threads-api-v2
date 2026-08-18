import { AiService } from '@api/modules/ai/service/ai.service';
import { OverviewDeclineService } from '@api/modules/post/service/overview-decline.service';
import { PostFeedService } from '@api/modules/post/service/post-feed.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduleOverviewCron {
  private readonly logger = new Logger(ScheduleOverviewCron.name);
  private static readonly CRON_NAME = 'schedule-overview';
  private static readonly CRON_EXPRESSION = CronExpression.EVERY_HOUR;
  private static readonly COUNT_REPLY_LIMIT_HOUR = 50;

  constructor(private readonly overviewDeclineService: OverviewDeclineService,
    private readonly postFeedService: PostFeedService,
    private readonly aiService: AiService
  ) { }

  @Cron(ScheduleOverviewCron.CRON_EXPRESSION, {
    name: ScheduleOverviewCron.CRON_NAME,
    waitForCompletion: true,
  })
  async handleCron(): Promise<void> {
    // Check reply in week, if reply < 50, then check content of post, if content is not enough, then mark post isDecline = true
    const postsWithReplyCount = await this.postFeedService.findPostDecideWithinWeek();
    const filteredPostsNotEnoughReply = postsWithReplyCount.filter(post => post._count.children < ScheduleOverviewCron.COUNT_REPLY_LIMIT_HOUR);

    // add business if post has 5 overview decline, then mark post isDecline = true, because should be discussed in the community, not in the overview

    //
    const resultMap = new Map<number, string>();
    if (filteredPostsNotEnoughReply.length > 0) {
      const result = await this.postFeedService.findLimitReplyInByPostIds(
        filteredPostsNotEnoughReply.map(post => post.id),
        ScheduleOverviewCron.COUNT_REPLY_LIMIT_HOUR
      );

      result.map((item) => {
        const content = item.content;
        if (item?.parentId) {
          resultMap.set(item?.parentId, content);
        }
      });

    }

    this.logger.debug(
      `Found ${postsWithReplyCount.length} decide posts with reply counts from the last hour`,
    );
  }
}
