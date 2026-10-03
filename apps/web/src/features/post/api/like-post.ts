import type { LikePostResponse, PublicIdParamsDto } from "@/types/post";
import { http } from "@/utils/http";

export type LikePostArgs = PublicIdParamsDto & { isLiked: boolean };

export const likePost = async ({ publicId }: LikePostArgs) =>
  http.post<LikePostResponse>(`/posts/${publicId}/like`);
