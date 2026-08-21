export const LIKE_SERVICE = Symbol('LIKE_SERVICE');
export type LikeServicePayload = { userId: string; postId: string };
export interface LikeService {
  createMany(payload: LikeServicePayload[]): Promise<unknown>;
  updateMany(payload: LikeServicePayload[]): Promise<{ count: number }>;
  deleteMany(payload: LikeServicePayload[]): Promise<{ count: number }>;
}
