import type { CreatePostDto } from '@api/modules/post/dto/request';

export type CreatePostPayload = CreatePostDto & {
    userId: string;
    groupTeamId?: number;
};

