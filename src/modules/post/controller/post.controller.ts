import { AUTH_MESSAGE, POST_MESSAGE } from "@/constants/message";
import { jwtService } from "@/modules/jwt/service/jwt.service";
import { userService } from "@/modules/user/service/user.service";
import { getPagination } from "@/shared/pagination/cursor-pagination";
import { Request, Response } from "express";
import { CreatePostDto, UpdatePostDto } from "../dto/post.dto";
import type { LikeDto } from "../dto/request/like.request";
import type { ReportDto } from "../dto/request/post.request";
import {
  CursorPaginationQueryDto,
  NewsFeedQueryDto,
  PostIdParamsDto,
  PublicIdParamsDto,
  UsernameParamsDto,
} from "../dto/request/post.request";
import { postService } from "../service/post.service";

type SearchQueryDto = {
  q?: string;
  topics?: string;
  limit?: string;
  page?: string;
};

class PostController {
  async getNewsFeedController(
    req: Request<{}, {}, {}, NewsFeedQueryDto>,
    res: Response,
  ) {
    const { after, take } = getPagination(req);
    const userId = await jwtService.requestAuthToken(req);

    const { posts, pagination } = await postService.getNewsFeed({
      after: after ?? undefined,
      take,
      userId,
      feedType: req.query_parsed.type,
    });

    return res.paginate({ rows: posts, pagination });
  }

  async getPostMe(
    req: Request<{}, {}, {}, CursorPaginationQueryDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const { after, take } = getPagination(req);
    const { posts, pagination } = await postService.getPostMe({
      after: after ?? undefined,
      take,
      userId,
    });

    return res.paginate({ rows: posts, pagination });
  }

  async getPostsByUser(
    req: Request<UsernameParamsDto, {}, {}, CursorPaginationQueryDto>,
    res: Response,
  ) {
    const { after, take } = getPagination(req);
    const user = await userService.findByUsername(req.params.username);

    if (!user) {
      return res.error(404, "User not found");
    }

    const { posts, pagination } = await postService.getPostsByUser({
      after: after ?? undefined,
      take,
      userId: user.id,
    });

    return res.paginate({ rows: posts, pagination });
  }

  async getReplies(
    req: Request<PublicIdParamsDto, {}, {}, CursorPaginationQueryDto>,
    res: Response,
  ) {
    const { after, take } = getPagination(req);
    const { posts, pagination } = await postService.getReplies({
      after: after ?? undefined,
      take,
      publicId: req.params.publicId,
    });

    return res.paginate({ rows: posts, pagination });
  }

  async getRepliesMe(
    req: Request<{}, {}, {}, CursorPaginationQueryDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const { after, take } = getPagination(req);
    const { posts, pagination } = await postService.getRepliesByUser({
      after: after ?? undefined,
      take,
      userId,
    });

    return res.paginate({ rows: posts, pagination });
  }

  async getRepliesByUser(
    req: Request<UsernameParamsDto, {}, {}, CursorPaginationQueryDto>,
    res: Response,
  ) {
    const { after, take } = getPagination(req);
    const user = await userService.findByUsername(req.params.username);

    if (!user) {
      return res.error(404, "User not found");
    }

    const { posts, pagination } = await postService.getRepliesByUser({
      after: after ?? undefined,
      take,
      userId: user.id,
    });

    return res.paginate({ rows: posts, pagination });
  }

  async getQuoteMe(
    req: Request<{}, {}, {}, CursorPaginationQueryDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const { after, take } = getPagination(req);
    const { posts, pagination } = await postService.getQuote({
      after: after ?? undefined,
      take,
      userId,
    });

    return res.paginate({ rows: posts, pagination });
  }

  async getQuote(
    req: Request<UsernameParamsDto, {}, {}, CursorPaginationQueryDto>,
    res: Response,
  ) {
    const { after, take } = getPagination(req);
    const user = await userService.findByUsername(req.params.username);

    if (!user) {
      return res.error(404, "User not found");
    }

    const { posts, pagination } = await postService.getQuote({
      after: after ?? undefined,
      take,
      userId: user.id,
    });

    return res.paginate({ rows: posts, pagination });
  }

  async createPostController(
    req: Request<{}, {}, CreatePostDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const post = await postService.create({
      ...req.body,
      userId,
    });

    return res.success(201, POST_MESSAGE.CREATED, post);
  }

  async create(req: Request<{}, {}, CreatePostDto>, res: Response) {
    return this.createPostController(req, res);
  }

  async getThread(req: Request<PublicIdParamsDto>, res: Response) {
    const post = await postService.getById(req.params.publicId);

    if (!post) {
      return res.error(404, "Post not found");
    }

    return res.success(200, POST_MESSAGE.RETRIEVED, post);
  }

  async getPost(req: Request<PublicIdParamsDto>, res: Response) {
    const post = await postService.getById(req.params.publicId);

    if (!post) {
      return res.error(404, "Post not found");
    }

    return res.success(200, POST_MESSAGE.RETRIEVED, post);
  }

  async getJudgeStatus(req: Request<PostIdParamsDto>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const judgeStatus = await postService.getJudgeStatus(req.params.postId);
    return res.success(200, "Judge status retrieved successfully", judgeStatus);
  }

  async replyPost(
    req: Request<PublicIdParamsDto, {}, CreatePostDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const reply = await postService.reply(req.params.publicId, {
      ...req.body,
      userId,
    });
    return res.success(201, POST_MESSAGE.CREATED, reply);
  }

  async likePost(req: Request<PublicIdParamsDto, {}, LikeDto>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    await postService.like(req.params.publicId, userId, req.body.isLiked);
    return res.success(200, POST_MESSAGE.RETRIEVED, {
      liked: req.body.isLiked,
    });
  }

  async repostPost(
    req: Request<PublicIdParamsDto, {}, CreatePostDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const originPost = await postService.getById(req.params.publicId);

    if (!originPost) {
      return res.error(404, "Origin post not found");
    }
    const repost = await postService.repost(
      {
        publicId: req.params.publicId,
        content: req.body.content ?? "",
        replyPermission: req.body.replyPermission,
        visibility: req.body.visibility,
      },
      userId,
    );

    return res.success(201, POST_MESSAGE.CREATED, repost);
  }

  async quotePost(
    req: Request<PublicIdParamsDto, {}, CreatePostDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const quote = await postService.quote(req.params.publicId, {
      ...req.body,
      userId,
    });
    return res.success(201, POST_MESSAGE.CREATED, quote);
  }

  async savePost(req: Request<PublicIdParamsDto>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    await postService.save(req.params.publicId, userId);
    return res.success(200, POST_MESSAGE.RETRIEVED, { saved: true });
  }

  async hidePost(req: Request<PublicIdParamsDto>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    await postService.hide(req.params.publicId, userId);
    return res.success(200, POST_MESSAGE.RETRIEVED, { hidden: true });
  }

  async reportPost(
    req: Request<PublicIdParamsDto, {}, ReportDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    await postService.report(req.params.publicId, { ...req.body, userId });
    return res.success(200, POST_MESSAGE.RETRIEVED, { reported: true });
  }

  async deletePost(req: Request<PublicIdParamsDto>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    await postService.delete(req.params.publicId, userId);
    return res.success(200, POST_MESSAGE.RETRIEVED, { deleted: true });
  }

  async updatePost(
    req: Request<PublicIdParamsDto, {}, UpdatePostDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const post = await postService.update(
      req.params.publicId,
      userId,
      req.body,
    );
    return res.success(200, POST_MESSAGE.RETRIEVED, post);
  }

  async search(req: Request<{}, {}, {}, SearchQueryDto>, res: Response) {
    const query = {
      q: req.query.q ?? "",
      topics: req.query.topics ?? "",
      limit: req.query.limit ?? "",
      page: req.query.page ?? "",
    };

    const results = await postService.search(query);

    return res.success(200, POST_MESSAGE.SEARCH_SUCCESS, results);
  }
}

export const postController = new PostController();
