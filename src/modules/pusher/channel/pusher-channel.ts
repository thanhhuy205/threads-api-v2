import type { NotificationType } from "@/modules/notification-group/model/notification.model";

const PRIVATE_USER_PREFIX = "private-user-";

const privateUser = (userId: string) => `${PRIVATE_USER_PREFIX}${userId}`;

const user = () => "user";

const notification = ({ type, userId, typeId }: { type: NotificationType; userId: string; typeId: string }) => `notify:${type}:${userId}:${typeId}`;


const privateNotification = (userId: string) => `private-user-notification-${userId}`;
const privateReport = (userId: string) => `private-report-${userId}`;
const privateGeneratedImage = (userId: string) => `private-generated-image-${userId}`;

export const pusherChannel = {
  privateUser,
  user,
  privateNotification,
  notification,
  privateGeneratedImage,
  privateReport
} as const;
