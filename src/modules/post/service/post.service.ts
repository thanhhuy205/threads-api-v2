import { CreatePostPayload, PostRecord, postRepository } from '../repo/post.repository';

class PostService {
    async create(payload: CreatePostPayload): Promise<PostRecord> {
        return postRepository.create(payload);
    }

    async list(): Promise<PostRecord[]> {
        return postRepository.list();
    }
}

export const postService = new PostService();
