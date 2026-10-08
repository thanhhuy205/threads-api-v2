import type { CreatePostCommand } from '../../commands/create-post.command';
export const POST_MENTION_SERVICE = Symbol('POST_MENTION_SERVICE');
export type MentionNotificationPayload = { mentionIds: string[]; actorId: string; username: string; avatar?: string; targetPostId: string; originPostId: string; postOwnerId: string; content: string };
export interface PostMentionService {
  validateMentions(mentions?: CreatePostCommand['mentions']): Promise<string[]>;
  /* MAINTENANCE: mention notifications are temporarily disabled.
  dispatchMentionNotifications(payload: MentionNotificationPayload): Promise<void>;
  */
}
