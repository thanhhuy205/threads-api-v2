import type { CreatePostCommand } from '../command/create-post.command';
export const POST_SERVICE = Symbol('POST_SERVICE');
export interface PostService {
  create(payload: CreatePostCommand): Promise<any>;
  reply(publicId: string, payload: CreatePostCommand): Promise<any>;
  // MAINTENANCE: repost(publicId: string, userId: string): Promise<any>;
  // MAINTENANCE: quote(publicId: string, payload: CreatePostCommand): Promise<any>;
}
