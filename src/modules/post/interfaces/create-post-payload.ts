import type { CreatePostDto } from '@/modules/post/dto/post.dto';

export type CreatePostPayload = CreatePostDto & {
    userId: string;
};
