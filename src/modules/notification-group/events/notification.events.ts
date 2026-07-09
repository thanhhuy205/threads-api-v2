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


export type MessageNotification = {
  groupPublicId: string;
  name: string,
  recipientId: string;
  senderId: string;
  content: string;
  avatar?: string;
};


export type CreateNotificationMessageGroupEvent = {
  groupPublicId: string;
  name: string;
  avatar: string;
  content: string;
  senderId: string;
  recipientId: string;
  type: 'MESSAGE';
  targetType: 'MESSAGE_GROUP';
}