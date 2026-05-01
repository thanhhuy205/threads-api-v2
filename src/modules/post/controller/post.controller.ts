import { Request, Response } from 'express';
import { postService } from '../service/post.service';

class PostController {
    async list(req: Request, res: Response) {
        const posts = await postService.list();
        return res.success(200, 'Posts retrieved', posts);
    }

    async create(req: Request, res: Response) {
        const post = await postService.create(req.body);
        return res.success(201, 'Post created', post);
    }
}

export const postController = new PostController();