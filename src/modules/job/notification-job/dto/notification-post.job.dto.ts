import { PostType } from "@prisma/client";

export interface NotificationPostJobDto {
    postPublicId: string,
    userId: string,
    authorId: string,
    requestedAt: string,
    typePost: PostType
}