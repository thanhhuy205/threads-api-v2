import { jwtService } from '@/modules/jwt/service/jwt.service';
import { getPagination } from '@/shared/pagination/pagination';
import { Request, Response } from 'express';
import { CreatePostDto } from '../dto/post.dto';
import {
    NewsFeedQueryDto,
    PaginationQueryDto,
    PostIdParamsDto,
    UserIdParamsDto,
} from '../dto/request/post.request';
import { postService } from '../service/post.service';

class PostController {
    async getNewsFeedController(req: Request<{}, {}, {}, NewsFeedQueryDto>, res: Response) {
        const { currentPage, perPage } = getPagination(req);
        const userId = await jwtService.requestAuthToken(req);

        const { posts, pagination } = await postService.getNewsFeed({
            currentPage,
            perPage,
            userId,
            feedType: req.query.feedType,
        });

        return res.paginate({ rows: posts, pagination });
    }

    async getPostMe(req: Request<{}, {}, {}, PaginationQueryDto>, res: Response) {
        const userId = req.user?.sub;

        if (!userId) {
            return res.error(401, 'TOKEN_INVALID');
        }

        const { currentPage, perPage } = getPagination(req);
        const { posts, pagination } = await postService.getPostMe({
            currentPage,
            perPage,
            userId,
        });

        return res.paginate({ rows: posts, pagination });
    }

    async getReplies(req: Request<PostIdParamsDto, {}, {}, PaginationQueryDto>, res: Response) {
        const { currentPage, perPage } = getPagination(req);
        const { posts, pagination } = await postService.getReplies({
            currentPage,
            perPage,
            postId: req.params.postId,
        });

        return res.paginate({ rows: posts, pagination });
    }

    async getRepost(req: Request<UserIdParamsDto, {}, {}, PaginationQueryDto>, res: Response) {
        const { currentPage, perPage } = getPagination(req);
        const { posts, pagination } = await postService.getRepost({
            currentPage,
            perPage,
            userId: req.params.userId,
        });

        return res.paginate({ rows: posts, pagination });
    }

    async getQuote(req: Request<UserIdParamsDto, {}, {}, PaginationQueryDto>, res: Response) {
        const { currentPage, perPage } = getPagination(req);
        const { posts, pagination } = await postService.getQuote({
            currentPage,
            perPage,
            userId: req.params.userId,
        });

        return res.paginate({ rows: posts, pagination });
    }

    async createPostController(req: Request<{}, {}, CreatePostDto>, res: Response) {
        const userId = req.user?.sub;

        if (!userId) {
            return res.error(401, 'TOKEN_INVALID');
        }

        const post = await postService.create({
            ...req.body,
            authorId: userId,
        });

        return res.success(201, 'Post created', post);
    }

    async list(req: Request, res: Response) {
        const posts = await postService.list();
        return res.success(200, 'Posts retrieved', posts);
    }

    async create(req: Request<{}, {}, CreatePostDto>, res: Response) {
        return this.createPostController(req, res);
    }
}

export const postController = new PostController();