import { NotificationType } from "@prisma/client";

export type CreateNotificationGroupInput = {
    recipientId: string;
    actorId: string;
    type: NotificationType;
    targetType: string;
    targetId: string;
    lastEventAt?: Date;
    userId?: string | null;
};

export type FindAllNotificationGroupsInput = {
    recipientId: string;
    after?: string;
    take: number;
};
