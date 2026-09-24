import type { GetPostWithPublicIdCommand } from '../commands/get-post-with-public-id.command';
import type { GetPostWithUserCommand } from '../commands/get-post-with-user.command';
import type { NewsFeedCommand } from '../commands/news-feed.command';

export const POST_FEED_SERVICE = Symbol('POST_FEED_SERVICE');
export interface PostFeedService {
  getNewsFeed(payload: NewsFeedCommand): Promise<any>;
  getPostMe(payload: GetPostWithUserCommand): Promise<any>;
  getReplies(payload: GetPostWithPublicIdCommand): Promise<any>;
  getQuote(payload: GetPostWithUserCommand): Promise<any>;
  getById(publicId: string, userId?: string | null): Promise<any>;
  findFirstReplyByPostPublicId(count: number, publicId: string): Promise<any[]>;
}
