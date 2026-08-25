import type { GetPostWithPublicIdCommand } from '../command/get-post-with-public-id.command';
import type { GetPostWithUserCommand } from '../command/get-post-with-user.command';
import type { NewsFeedCommand } from '../command/news-feed.command';

export const POST_FEED_SERVICE = Symbol('POST_FEED_SERVICE');
export interface PostFeedService {
  getNewsFeed(payload: NewsFeedCommand): Promise<any>;
  getPostMe(payload: GetPostWithUserCommand): Promise<any>;
  getReplies(payload: GetPostWithPublicIdCommand): Promise<any>;
  getQuote(payload: GetPostWithUserCommand): Promise<any>;
  getById(publicId: string, userId?: string | null): Promise<any>;
  findFirstReplyByPostPublicId(count: number, publicId: string): Promise<any[]>;
  findLimitReplyInByPostIds(postIds: number[], limit: number): Promise<any[]>;
  findPostDecideWithinWeekByIds(postIds: number[]): Promise<any[]>;
  findManyInWeek(): Promise<any[]>;
  countOverviewDeclineByPostId(postIds: number[]): Promise<any[]>;
  updateManyDecideStatus(postIds: number[], isDecline: boolean): Promise<any>;
}
