import { GroupType } from "@prisma/client";

type MessageResponseInput = {
  publicId: string;
  messageGroup: {
    publicId: string;
  },
  senderId: string;
  content: string;
  createdAt: Date;
};

type MessageGroupMemberUserResponse = {
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
};

type MessageGroupMemberResponse = {
  id: string;
  user: MessageGroupMemberUserResponse;
  unreadCount?: number;
};

type MessageGroupResponseInput = {
  publicId: string;
  name: string;
  groupType: GroupType;
  lastMessageAt: Date;
  createdAt: Date;
  members: MessageGroupMemberResponse[];
};

export const mapMessageResponse = (message: MessageResponseInput) => ({
  publicId: message.publicId,
  messageGroupId: message.messageGroup.publicId,
  senderId: message.senderId,
  content: message.content,
  createdAt: message.createdAt,
});

export const mapMessageGroupResponse = (
  messageGroup: MessageGroupResponseInput,
  currentUserId: string,
) => ({
  unreadCount:
    messageGroup.members.find((member) => member.user.id === currentUserId)
      ?.unreadCount ?? 0,
  publicId: messageGroup.publicId,
  name: messageGroup.name,
  groupType: messageGroup.groupType,
  lastMessageAt: messageGroup.lastMessageAt,
  createdAt: messageGroup.createdAt,
  members: messageGroup.members
    .filter((member) => member.user.id !== currentUserId)
    .map((member) => ({
      id: member.id,
      user: member.user,
      unreadCount: member.unreadCount ?? 0,
    })),
});

export const mapMessageGroupMemberResponse = (
  member: MessageGroupMemberResponse,
) => ({
  id: member.id,
  user: member.user,
});
