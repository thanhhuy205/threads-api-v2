import { AiService } from '@api/modules/ai/service/ai.service';
import { OVERVIEW_DECLINE_SERVICE, type OverviewDeclineService } from '@post-service/modules/post/service/overview-decline.service';
import { POST_FEED_SERVICE, type PostFeedService } from '@post-service/modules/post/service/post-feed.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduleOverviewCron {
  private readonly logger = new Logger(ScheduleOverviewCron.name);
  private static readonly CRON_NAME = 'schedule-overview';
  private static readonly CRON_EXPRESSION = CronExpression.EVERY_HOUR;
  private static readonly COUNT_REPLY_LIMIT_HOUR = 50;

  constructor(@Inject(OVERVIEW_DECLINE_SERVICE) private readonly overviewDeclineService: OverviewDeclineService,
    @Inject(POST_FEED_SERVICE) private readonly postFeedService: PostFeedService,
    private readonly aiService: AiService
  ) { }

  @Cron(ScheduleOverviewCron.CRON_EXPRESSION, {
    name: ScheduleOverviewCron.CRON_NAME,
    waitForCompletion: true,
  })
  async handleCron(): Promise<void> {
    const postsInWeek = await this.postFeedService.findManyInWeek();


    // add business if post has 5 overview decline, then mark post isDecline = true, because should be discussed in the community, not in the overview
    const postsWithOverviewDecline = await this.postFeedService.countOverviewDeclineByPostId(
      postsInWeek.map(post => post.id)
    );

    let postsLeastLimit: number[] = [];

    if (postsWithOverviewDecline.length > 0) {
      const postsThanLimitOverviewDecline = postsWithOverviewDecline.filter(post => {
        if (post._count.overviewDeclines >= 5) {
          return true;
        }
        postsLeastLimit.push(post.id);
        return false;
      });

      if (postsThanLimitOverviewDecline.length > 0) {
        await this.postFeedService.updateManyDecideStatus(
          postsThanLimitOverviewDecline.map(post => post.id),
          true
        );
      }
    }

    // Check reply in week, if reply < 50, then check content of post, if content is not enough, then mark post isDecline = true
    const postsWithReplyCount = await this.postFeedService.findPostDecideWithinWeekByIds(
      postsLeastLimit
    );


    const filteredPostsNotEnoughReply = postsWithReplyCount.filter(post => post._count.children < ScheduleOverviewCron.COUNT_REPLY_LIMIT_HOUR);

    const resultMap = new Map<number, string>();
    if (filteredPostsNotEnoughReply.length > 0) {
      const result = await this.postFeedService.findLimitReplyInByPostIds(
        filteredPostsNotEnoughReply.map(post => post.id),
        ScheduleOverviewCron.COUNT_REPLY_LIMIT_HOUR // take limit
      );

      result.map((item) => {
        const content = item.content;
        if (item?.parentId) {
          resultMap.set(item?.parentId, content);
        }
      });

    }
    /// Logic AI 

    this.logger.debug(
      `Found ${postsWithReplyCount.length} decide posts with reply counts from the last hour`,
    );
  }
}
