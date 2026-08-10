import { Injectable } from '@nestjs/common';
import { LikeRepository } from '@/modules/post/repository/like.repository';

@Injectable()
export class LikeService {
    constructor(private readonly likeRepository: LikeRepository) {}

    async createMany(payload: {
        userId: string, postId: string
    }[]) {
        return this.likeRepository.createMany(payload);
    }
    async updateMany(payload: {
        userId: string, postId: string
    }[]) {
        return this.likeRepository.updateMany(payload);
    }
    deleteMany(payload: {
        userId: string, postId: string
    }[]) {
        return this.likeRepository.deleteMany(payload);
    }
}
