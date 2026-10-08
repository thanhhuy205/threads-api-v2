import type { GetPostWithUserCommand } from '../../commands/get-post-with-user.command';
export const POST_USER_SERVICE = Symbol('POST_USER_SERVICE');
export interface PostUserService {
  getPostsByUser(payload: GetPostWithUserCommand): Promise<any>;
  getRepliesByUser(payload: GetPostWithUserCommand): Promise<any>;
}
