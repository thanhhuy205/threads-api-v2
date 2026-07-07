import { AUTH_MESSAGE, POST_MESSAGE } from "@/constants/message";
import { jwtService } from "@/modules/jwt/service/jwt.service";
import { userService } from "@/modules/user/service/user.service";
import { getPagination } from "@/shared/pagination/cursor-pagination";
import { Request, Response } from "express";
import { CreatePostDto, UpdatePostDto } from "../dto/post.dto";
import type { LikeDto } from "../dto/request/like.request";
import type {
  HidePostDto,
  ReportDto,
  SavePostDto,
  SimilarPostsDto,
} from "../dto/request/post.request";
import {
  CursorPaginationQueryDto,
  NewsFeedQueryDto,
  PublicIdParamsDto,
  UsernameParamsDto
} from "../dto/request/post.request";
import { postActionService } from "../service/post-action.service";
import { postFeedService } from "../service/post-feed.service";
import { postUserService } from "../service/post-user.service";
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

    const { posts, pagination } = await postFeedService.getNewsFeed({
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
    const { posts, pagination } = await postFeedService.getPostMe({
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

    const myUserId = await jwtService.requestAuthToken(req);
    const { posts, pagination } = await postUserService.getPostsByUser({
      after: after ?? undefined,
      take,
      userId: user.id,
      myUserId: myUserId ?? undefined,
    });

    return res.paginate({ rows: posts, pagination });
  }

  async getReplies(
    req: Request<PublicIdParamsDto, {}, {}, CursorPaginationQueryDto>,
    res: Response,
  ) {
    const { after, take } = getPagination(req);
    const userId = await jwtService.requestAuthToken(req);
    const { posts, pagination } = await postFeedService.getReplies({
      after: after ?? undefined,
      take,
      publicId: req.params.publicId,
      userId,
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
    const { posts, pagination } = await postUserService.getRepliesByUser({
      after: after ?? undefined,
      take,
      userId,
      myUserId: userId,
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

    const myUserId = await jwtService.requestAuthToken(req);
    const { posts, pagination } = await postUserService.getRepliesByUser({
      after: after ?? undefined,
      take,
      userId: user.id,
      myUserId: myUserId ?? undefined,
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
    const { posts, pagination } = await postFeedService.getQuote({
      after: after ?? undefined,
      take,
      userId,
      myUserId: userId,
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

    const myUserId = await jwtService.requestAuthToken(req);
    const { posts, pagination } = await postFeedService.getQuote({
      after: after ?? undefined,
      take,
      userId: user.id,
      myUserId: myUserId ?? undefined,
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
    const userId = await jwtService.requestAuthToken(req);
    const post = await postFeedService.getById(req.params.publicId, userId);

    if (!post) {
      return res.error(404, "Post not found");
    }

    return res.success(200, POST_MESSAGE.RETRIEVED, post);
  }

  async getPost(req: Request<PublicIdParamsDto>, res: Response) {
    const userId = await jwtService.requestAuthToken(req);
    const post = await postFeedService.getById(req.params.publicId, userId);

    if (!post) {
      return res.error(404, "Post not found");
    }

    return res.success(200, POST_MESSAGE.RETRIEVED, post);
  }

  async getSimilarPosts(
    req: Request<PublicIdParamsDto, {}, SimilarPostsDto>,
    res: Response,
  ) {
    const posts = await postService.getSimilarPosts(
      req.params.publicId,
      req.body,
    );

    return res.success(200, POST_MESSAGE.RETRIEVED, posts);
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

    const result = await postActionService.like(req.params.publicId, userId, req.body.isLiked);
    return res.success(200, POST_MESSAGE.RETRIEVED, {
      liked: result,
    });
  }

  async repostPost(req: Request<PublicIdParamsDto>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const repost = await postService.repost(req.params.publicId, userId);

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

  async savePost(
    req: Request<PublicIdParamsDto, {}, SavePostDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    await postActionService.save(req.params.publicId, userId, req.body.isSaved);
    return res.success(200, POST_MESSAGE.RETRIEVED, {
      saved: req.body.isSaved,
    });
  }

  async hidePost(
    req: Request<PublicIdParamsDto, {}, HidePostDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    await postActionService.hide(req.params.publicId, userId, req.body.isHidden);
    return res.success(200, POST_MESSAGE.RETRIEVED, {
      hidden: req.body.isHidden,
    });
  }

  async reportPost(
    req: Request<PublicIdParamsDto, {}, ReportDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    const report = await postActionService.report(req.params.publicId, {
      ...req.body,
      reporterId: userId,
    });
    return res.success(200, POST_MESSAGE.RETRIEVED, {
      reported: true,
      report,
    });
  }

  async deletePost(req: Request<PublicIdParamsDto>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
    }

    await postActionService.delete(req.params.publicId, userId);
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

    const post = await postActionService.update(
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
