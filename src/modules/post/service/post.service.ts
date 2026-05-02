import { CreatePostDto } from '../dto/post.dto';
import { PostRecord, postRepository } from '../repository/post.repository';

class PostService {
    async create(payload: CreatePostDto): Promise<PostRecord> {
        return postRepository.create(payload);
    }

    async list(): Promise<PostRecord[]> {
        return postRepository.list();
    }
}

export const postService = new PostService();
