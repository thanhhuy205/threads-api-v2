import { Inject, Injectable } from '@nestjs/common';
import { LIKE_REPOSITORY, type LikeRepository } from '../../application/ports/inbound/like.repository';
import type { LikeService } from '../../application/use-cases/like.service';

@Injectable()
export class LikeServiceImpl implements LikeService {
    constructor(@Inject(LIKE_REPOSITORY) private readonly likeRepository: LikeRepository) { }

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
