export type LikeCommand = { userId: string; postId: string };

export type CreateLikeCommand = LikeCommand & { isLike: boolean };
