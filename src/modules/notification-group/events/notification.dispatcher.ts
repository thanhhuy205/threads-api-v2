import type { MentionNotification, ReplyNotification } from './notification.events';

type NotificationHandlers = {
  handleReply: (payload: ReplyNotification) => Promise<unknown>;
  handleMention: (payload: MentionNotification) => Promise<unknown>;
};

let handlers: NotificationHandlers | undefined;

export const registerNotificationHandlers = (nextHandlers: NotificationHandlers) => {
  handlers = nextHandlers;
};

export const dispatchReplyNotification = (payload: ReplyNotification) => {
  if (!handlers) throw new Error('Notification module is not initialized');
  return handlers.handleReply(payload);
};

export const dispatchMentionNotification = (payload: MentionNotification) => {
  if (!handlers) throw new Error('Notification module is not initialized');
  return handlers.handleMention(payload);
};
