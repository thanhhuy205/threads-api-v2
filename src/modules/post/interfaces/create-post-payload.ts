import type { CreatePostDto } from '@/modules/post/dto/post.dto';
import type { PostType, ReplyPermission } from '@prisma/client';

export type CreatePostPayload = CreatePostDto & {
    userId: string;
};

export type CreateCirclePostPayload = {
    userId: string;
    content: string;
    contentJson?: unknown;
    type?: PostType;
    replyPermission?: ReplyPermission;
    mediaUrls?: string[];
};
