import { PostType } from "../../../../../generated/prisma";

export interface NotificationPostJobDto {
    postPublicId: string,
    userId: string,
    authorId: string,
    requestedAt: string,
    typePost: PostType
}
