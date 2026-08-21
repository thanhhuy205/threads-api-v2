import type { CreatePostDto } from '../dto/request';

export type CreatePostCommand = CreatePostDto & {
  userId: string;
  groupTeamId?: number;
};
