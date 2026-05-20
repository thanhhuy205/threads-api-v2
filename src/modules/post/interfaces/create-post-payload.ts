import type { CreatePostDto } from '@/modules/post/dto/post.dto';
import type { PostType, ReplyPermission, VisibilityPost } from '@prisma/client';

export type CreatePostPayload = CreatePostDto & {
    userId: string;
};

export type CreateCirclePostPayload = Omit<CreatePostDto, "visibility" | "replyPermission"> & {
    userId: string;
    type?: PostType;
    visibility?: VisibilityPost;
    replyPermission?: ReplyPermission;
};
