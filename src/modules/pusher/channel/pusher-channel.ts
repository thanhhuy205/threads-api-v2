import { NotificationType } from "@prisma/client";

const PRIVATE_CHAT_PREFIX = "private-chat-";
const PRIVATE_USER_PREFIX = "private-user-";

const privateChat = (publicId: string) => `${PRIVATE_CHAT_PREFIX}${publicId}`;

const privateUser = (userId: string) => `${PRIVATE_USER_PREFIX}${userId}`;

const user = () => "user";

const notification = ({ type, userId, typeId }: { type: NotificationType; userId: string; typeId: string }) => `notify:${type}:${userId}:${typeId}`;


const isPrivateChatChannel = (channelName: string) =>
  channelName.startsWith(PRIVATE_CHAT_PREFIX);

const extractPrivateChatPublicId = (channelName: string) => {
  if (!isPrivateChatChannel(channelName)) {
    return null;
  }

  const publicId = channelName.slice(PRIVATE_CHAT_PREFIX.length).trim();
  return publicId.length > 0 ? publicId : null;
};


const privateNotification = (userId: string) => `private-user-notification-${userId}`;
const privateNotificationMessage = (userId: string) => `private-notification-message-${userId}`;
const privateReport = (userId: string) => `private-report-${userId}`;
export const pusherChannel = {
  privateChat,
  privateUser,
  user,
  isPrivateChatChannel,
  extractPrivateChatPublicId,
  privateNotification,
  privateNotificationMessage,
  notification,
  privateReport
} as const;
