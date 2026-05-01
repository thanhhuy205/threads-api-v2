import { Request, Response } from 'express';
import { parseCreatePostDto } from '../dto/post.dto';
import { postService } from '../service/post.service';

class PostController {
    async list(req: Request, res: Response) {
        const posts = await postService.list();
        return res.success(200, 'Posts retrieved', posts);
    }

    async create(req: Request, res: Response) {
        const parsed = parseCreatePostDto(req.body);
        if (!parsed.success) {
            return res.error(422, 'Invalid payload', parsed.error.flatten());
        }

        const post = await postService.create(parsed.data);
        return res.success(201, 'Post created', post);
    }
}

export const postController = new PostController();