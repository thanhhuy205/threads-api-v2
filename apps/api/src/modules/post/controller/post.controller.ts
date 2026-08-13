import { CursorPagination } from "@/common/decorators/cursor-pagination.decorator";
import { IsPublic } from "@/common/decorators/is-public.decorator";
import { Message } from "@/common/decorators/message.decorator";
import { ApiCursorPaginatedResponse } from "@/common/decorators/swagger-response.decorator";
import type { CursorPagination as CursorPaginationParams } from "@/common/helpers/cursor-pagination.helper";
import { AUTH_MESSAGE, POST_MESSAGE } from "@/constants/message";
import { NotFoundException, UnauthorizedException } from "@/errors/error";
import { JwtService } from "@/modules/jwt/service/jwt.service";
import { UserService } from "@/modules/user/service/user.service";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  CreatePostDto,
  CursorPaginationQueryDto,
  HidePostDto,
  NewsFeedQueryDto,
  PublicIdParamsDto,
  ReportDto,
  SavePostDto,
  SearchPostQueryDto,
  UpdatePostDto,
  UsernameParamsDto,
} from "../dto/request";
import { PostActionService } from "../service/post-action.service";
import { PostFeedService } from "../service/post-feed.service";
import { PostSearchService } from "../service/post-search.service";
import { PostUserService } from "../service/post-user.service";
import { PostService } from "../service/post.service";

type AuthenticatedRequest = {
  headers: { authorization?: string | string[] | undefined };
  user?: { sub?: string };
};

@ApiTags("Post")
@Controller("posts")
export class PostController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly postActionService: PostActionService,
    private readonly postFeedService: PostFeedService,
    private readonly postSearchService: PostSearchService,
    private readonly postUserService: PostUserService,
  ) {}

  @Get("news-feed")
  @IsPublic()
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: "Get the news feed" })
  @ApiCursorPaginatedResponse({ description: POST_MESSAGE.RETRIEVED })
  async getNewsFeed(
    @Query() query: NewsFeedQueryDto,
    @CursorPagination() cursor: CursorPaginationParams,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = await this.jwtService.requestAuthToken(request);
    const { posts, pagination } = await this.postFeedService.getNewsFeed({
      after: cursor.after ?? undefined,
      take: cursor.take,
      userId,
      type: query.type ?? 'for_you',
    });
    return { data: posts, pagination };
  }

  @Get("search")
  @IsPublic()
  @Message(POST_MESSAGE.SEARCH_SUCCESS)
  @ApiOperation({ summary: "Search posts" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: POST_MESSAGE.SEARCH_SUCCESS,
  })
  search(@Query() query: SearchPostQueryDto) {
    return this.postSearchService.search({
      q: query.q ?? "",
      topics: query.topics ?? "",
      limit: query.limit ?? "",
      page: query.page ?? "",
    });
  }

  @Get("me")
  @ApiBearerAuth("bearer")
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: "Get current user posts" })
  @ApiCursorPaginatedResponse({ description: POST_MESSAGE.RETRIEVED })
  async getPostMe(
    @Query() _query: CursorPaginationQueryDto,
    @CursorPagination() cursor: CursorPaginationParams,
    @Req() request: AuthenticatedRequest,
  ) {
    const { posts, pagination } = await this.postFeedService.getPostMe({
      after: cursor.after ?? undefined,
      take: cursor.take,
      userId: this.userId(request),
    });
    return { data: posts, pagination };
  }

  @Get("me/replies")
  @ApiBearerAuth("bearer")
  @Message(POST_MESSAGE.REPLIES_RETRIEVED)
  @ApiOperation({ summary: "Get current user replies" })
  @ApiCursorPaginatedResponse({ description: POST_MESSAGE.REPLIES_RETRIEVED })
  async getRepliesMe(
    @Query() _query: CursorPaginationQueryDto,
    @CursorPagination() cursor: CursorPaginationParams,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = this.userId(request);
    const { posts, pagination } = await this.postUserService.getRepliesByUser({
      after: cursor.after ?? undefined,
      take: cursor.take,
      userId,
      myUserId: userId,
    });
    return { data: posts, pagination };
  }

  @Get("me/quote")
  @ApiBearerAuth("bearer")
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: "Get current user quotes and reposts" })
  @ApiCursorPaginatedResponse({ description: POST_MESSAGE.RETRIEVED })
  async getQuoteMe(
    @Query() _query: CursorPaginationQueryDto,
    @CursorPagination() cursor: CursorPaginationParams,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = this.userId(request);
    const { posts, pagination } = await this.postFeedService.getQuote({
      after: cursor.after ?? undefined,
      take: cursor.take,
      userId,
      myUserId: userId,
    });
    return { data: posts, pagination };
  }

  @Get("user/:username")
  @IsPublic()
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: "Get posts by username" })
  @ApiParam({ name: "username" })
  @ApiCursorPaginatedResponse({ description: POST_MESSAGE.RETRIEVED })
  async getPostsByUser(
    @Param() params: UsernameParamsDto,
    @Query() _query: CursorPaginationQueryDto,
    @CursorPagination() cursor: CursorPaginationParams,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = await this.getUser(params.username);
    const { posts, pagination } = await this.postUserService.getPostsByUser({
      after: cursor.after ?? undefined,
      take: cursor.take,
      userId: user.id,
      myUserId: (await this.jwtService.requestAuthToken(request)) ?? undefined,
    });
    return { data: posts, pagination };
  }

  @Get("user/:username/replies")
  @IsPublic()
  @Message(POST_MESSAGE.REPLIES_RETRIEVED)
  @ApiOperation({ summary: "Get replies by username" })
  @ApiParam({ name: "username" })
  @ApiCursorPaginatedResponse({ description: POST_MESSAGE.REPLIES_RETRIEVED })
  async getRepliesByUser(
    @Param() params: UsernameParamsDto,
    @Query() _query: CursorPaginationQueryDto,
    @CursorPagination() cursor: CursorPaginationParams,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = await this.getUser(params.username);
    const { posts, pagination } = await this.postUserService.getRepliesByUser({
      after: cursor.after ?? undefined,
      take: cursor.take,
      userId: user.id,
      myUserId: (await this.jwtService.requestAuthToken(request)) ?? undefined,
    });
    return { data: posts, pagination };
  }

  @Get("user/:username/quotes")
  @IsPublic()
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: "Get quotes and reposts by username" })
  @ApiParam({ name: "username" })
  @ApiCursorPaginatedResponse({ description: POST_MESSAGE.RETRIEVED })
  async getQuote(
    @Param() params: UsernameParamsDto,
    @Query() _query: CursorPaginationQueryDto,
    @CursorPagination() cursor: CursorPaginationParams,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = await this.getUser(params.username);
    const { posts, pagination } = await this.postFeedService.getQuote({
      after: cursor.after ?? undefined,
      take: cursor.take,
      userId: user.id,
      myUserId: (await this.jwtService.requestAuthToken(request)) ?? undefined,
    });
    return { data: posts, pagination };
  }

  @Get(":publicId/replies")
  @IsPublic()
  @Message(POST_MESSAGE.REPLIES_RETRIEVED)
  @ApiOperation({ summary: "Get replies to a post" })
  @ApiParam({ name: "publicId" })
  @ApiCursorPaginatedResponse({ description: POST_MESSAGE.REPLIES_RETRIEVED })
  async getReplies(
    @Param() params: PublicIdParamsDto,
    @Query() _query: CursorPaginationQueryDto,
    @CursorPagination() cursor: CursorPaginationParams,
    @Req() request: AuthenticatedRequest,
  ) {
    const { posts, pagination } = await this.postFeedService.getReplies({
      after: cursor.after ?? undefined,
      take: cursor.take,
      publicId: params.publicId,
      userId: await this.jwtService.requestAuthToken(request),
    });
    return { data: posts, pagination };
  }

  @Get(":publicId")
  @IsPublic()
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: "Get a post" })
  @ApiParam({ name: "publicId" })
  @ApiResponse({ status: HttpStatus.OK, description: POST_MESSAGE.RETRIEVED })
  async getPost(
    @Param() params: PublicIdParamsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const post = await this.postFeedService.getById(
      params.publicId,
      await this.jwtService.requestAuthToken(request),
    );
    if (!post) throw new NotFoundException("Post not found");
    return post;
  }

  @Post()
  @ApiBearerAuth("bearer")
  @Message(POST_MESSAGE.CREATED)
  @ApiOperation({ summary: "Create a post" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: POST_MESSAGE.CREATED,
  })
  createPost(
    @Body() payload: CreatePostDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.postService.create({
      ...payload,
      userId: this.userId(request),
    });
  }

  @Post(":publicId/reply")
  @ApiBearerAuth("bearer")
  @Message(POST_MESSAGE.CREATED)
  @ApiOperation({ summary: "Reply to a post" })
  @ApiParam({ name: "publicId" })
  replyPost(
    @Param() params: PublicIdParamsDto,
    @Body() payload: CreatePostDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.postService.reply(params.publicId, {
      ...payload,
      userId: this.userId(request),
    });
  }

  @Post(":publicId/like")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("bearer")
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: "Like or unlike a post" })
  async likePost(
    @Param() params: PublicIdParamsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return {
      liked: await this.postActionService.like(
        params.publicId,
        this.userId(request),
      ),
    };
  }

  @Post(":publicId/repost")
  @ApiBearerAuth("bearer")
  @Message(POST_MESSAGE.CREATED)
  @ApiOperation({ summary: "Repost a post" })
  repostPost(
    @Param() params: PublicIdParamsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.postService.repost(params.publicId, this.userId(request));
  }

  @Post(":publicId/quote")
  @ApiBearerAuth("bearer")
  @Message(POST_MESSAGE.CREATED)
  @ApiOperation({ summary: "Quote a post" })
  quotePost(
    @Param() params: PublicIdParamsDto,
    @Body() payload: CreatePostDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.postService.quote(params.publicId, {
      ...payload,
      userId: this.userId(request),
    });
  }

  @Post(":publicId/save")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("bearer")
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: "Save or unsave a post" })
  async savePost(
    @Param() params: PublicIdParamsDto,
    @Body() payload: SavePostDto,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.postActionService.save(
      params.publicId,
      this.userId(request),
      payload.isSaved,
    );
    return { saved: payload.isSaved };
  }

  @Post(":publicId/hide")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("bearer")
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: "Hide or unhide a post" })
  async hidePost(
    @Param() params: PublicIdParamsDto,
    @Body() payload: HidePostDto,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.postActionService.hide(
      params.publicId,
      this.userId(request),
      payload.isHidden,
    );
    return { hidden: payload.isHidden };
  }

  @Post(":publicId/report")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("bearer")
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: "Report a post or user" })
  async reportPost(
    @Param() params: PublicIdParamsDto,
    @Body() payload: ReportDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const report = await this.postActionService.report(params.publicId, {
      ...payload,
      reporterId: this.userId(request),
    });
    return { reported: true, report };
  }

  @Patch(":publicId")
  @ApiBearerAuth("bearer")
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: "Update a post" })
  updatePost(
    @Param() params: PublicIdParamsDto,
    @Body() payload: UpdatePostDto,
    @Req() request: AuthenticatedRequest,
  ) {
    if (payload.content === undefined) {
      throw new BadRequestException("Content is required");
    }
    return this.postActionService.update(
      params.publicId,
      this.userId(request),
      payload,
    );
  }

  @Delete(":publicId")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("bearer")
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: "Delete a post" })
  async deletePost(
    @Param() params: PublicIdParamsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.postActionService.delete(params.publicId, this.userId(request));
    return { deleted: true };
  }

  private async getUser(username: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  private userId(request: AuthenticatedRequest): string {
    if (!request.user?.sub)
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    return request.user.sub;
  }
}
