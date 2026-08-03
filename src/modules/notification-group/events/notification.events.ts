export type ReplyNotification = {
  replyContent: string;
  actorId: string;
  recipientId: string;
  lastActorId: string;
  lastActor?: {
    id: string;
    username: string;
    avatar: string;
  };
  targetPostId: string;
  originPostId: string;
  username: string;
  avatar?: string;
  postOwnerId: string;
};

export type MentionNotification = {
  mentionContent: string;
  actorId: string;
  recipientId: string;
  targetPostId: string;
  originPostId: string;
  username: string;
  avatar?: string;
  postOwnerId: string;
};

