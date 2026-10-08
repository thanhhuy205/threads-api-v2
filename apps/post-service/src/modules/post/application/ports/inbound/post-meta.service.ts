import type { Prisma } from '../../../../../generated/prisma/client';
import type { MentionNotificationPayload } from './post-mention.service';
export const POST_META_SERVICE = Symbol('POST_META_SERVICE');
export type CreatePostMeta = { topics?: string[]; mentionIds: string[] };
export interface PostMetaService {
  attachPostMeta(tx: Prisma.TransactionClient, postId: number, payload?: CreatePostMeta): Promise<void>;
  finalizePostCreation(params: { mentionNotification?: MentionNotificationPayload }): Promise<void>;
}
