import type { CreatePostDto } from '@/modules/post/dto/post.dto';

export type CreatePostPayload = CreatePostDto & {
    userId: string;
    media?: {
        id: number;
        key: string;
        url: string;
    }[];
};
