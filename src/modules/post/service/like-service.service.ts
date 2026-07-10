import { likeRepository } from "@/modules/post/repository/like.repository";

class LikeService {
    async createMany(payload: {
        userId: string, postId: string
    }[]) {
        return likeRepository.createMany(payload);
    }
    async updateMany(payload: {
        userId: string, postId: string
    }[]) {
        return likeRepository.updateMany(payload);
    }
    deleteMany(payload: {
        userId: string, postId: string
    }[]) {
        return likeRepository.deleteMany(payload);
    }
}
export const likeService = new LikeService();