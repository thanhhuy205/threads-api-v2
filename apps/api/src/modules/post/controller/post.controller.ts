import { CursorPagination } from "@/common/decorators/cursor-pagination.decorator";
import { GetUserId } from "@/common/decorators/get-user-id.decorator";
import { ResponseOperation } from "@/common/decorators/http-message-operration.decorator";
import { IsPublic } from "@/common/decorators/is-public.decorator";
import { Message } from "@/common/decorators/message.decorator";
import { ApiCursorPaginatedResponse } from "@/common/decorators/swagger-response.decorator";
import type { CursorPagination as CursorPaginationParams } from "@/common/helpers/cursor-pagination.helper";
import { POST_MESSAGE } from "@/constants/message";
import { NotFoundException } from "@/errors/error";
import { JwtService } from "@/modules/jwt/service/jwt.service";
import { UserService } from "@/modules/user/service/user.service";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
  ApiTags,
} from "@nestjs/swagger";
import {
  CreatePostDto,
  CursorPaginationQueryDto,
  HidePostDto,
  NewsFeedQueryDto,
  PublicIdParamsDto,
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
  @ResponseOperation(POST_MESSAGE.SEARCH_SUCCESS, HttpStatus.OK, "Search posts")
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
    @GetUserId() userId: string,
  ) {
    const { posts, pagination } = await this.postFeedService.getPostMe({
      after: cursor.after ?? undefined,
      take: cursor.take,
      userId,
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
    @GetUserId() userId: string,
  ) {
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
    @GetUserId() userId: string,
  ) {
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
  @ResponseOperation(POST_MESSAGE.RETRIEVED, HttpStatus.OK, "Get a post")
  @ApiParam({ name: "publicId" })
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
  @ResponseOperation(POST_MESSAGE.CREATED, HttpStatus.CREATED, "Create a post")
  createPost(
    @Body() payload: CreatePostDto,
    @GetUserId() userId: string,
  ) {
    return this.postService.create({
      ...payload,
      userId,
    });
  }

  @Post(":publicId/reply")
  @ApiBearerAuth("bearer")
  @ResponseOperation(POST_MESSAGE.CREATED, HttpStatus.CREATED, "Reply to a post")
  @ApiParam({ name: "publicId" })
  replyPost(
    @Param() params: PublicIdParamsDto,
    @Body() payload: CreatePostDto,
    @GetUserId() userId: string,
  ) {
    return this.postService.reply(params.publicId, {
      ...payload,
      userId,
    });
  }

  @Post(":publicId/like")
  @ApiBearerAuth("bearer")
  @ResponseOperation(POST_MESSAGE.RETRIEVED, HttpStatus.OK, "Like or unlike a post")
  async likePost(
    @Param() params: PublicIdParamsDto,
    @GetUserId() userId: string,
  ) {
    return {
      liked: await this.postActionService.like(
        params.publicId,
        userId,
      ),
    };
  }

  @Post(":publicId/repost")
  @ApiBearerAuth("bearer")
  @ResponseOperation(POST_MESSAGE.CREATED, HttpStatus.CREATED, "Repost a post")
  repostPost(
    @Param() params: PublicIdParamsDto,
    @GetUserId() userId: string,
  ) {
    return this.postService.repost(params.publicId, userId);
  }

  @Post(":publicId/quote")
  @ApiBearerAuth("bearer")
  @ResponseOperation(POST_MESSAGE.CREATED, HttpStatus.CREATED, "Quote a post")
  quotePost(
    @Param() params: PublicIdParamsDto,
    @Body() payload: CreatePostDto,
    @GetUserId() userId: string,
  ) {
    return this.postService.quote(params.publicId, {
      ...payload,
      userId,
    });
  }

  @Post(":publicId/save")
  @ApiBearerAuth("bearer")
  @ResponseOperation(POST_MESSAGE.RETRIEVED, HttpStatus.OK, "Save or unsave a post")
  async savePost(
    @Param() params: PublicIdParamsDto,
    @Body() payload: SavePostDto,
    @GetUserId() userId: string,
  ) {
    await this.postActionService.save(
      params.publicId,
      userId,
      payload.isSaved,
    );
    return { saved: payload.isSaved };
  }

  @Post(":publicId/hide")
  @ApiBearerAuth("bearer")
  @ResponseOperation(POST_MESSAGE.RETRIEVED, HttpStatus.OK, "Hide or unhide a post")
  async hidePost(
    @Param() params: PublicIdParamsDto,
    @Body() payload: HidePostDto,
    @GetUserId() userId: string,
  ) {
    await this.postActionService.hide(
      params.publicId,
      userId,
      payload.isHidden,
    );
    return { hidden: payload.isHidden };
  }

  @Patch(":publicId")
  @ApiBearerAuth("bearer")
  @ResponseOperation(POST_MESSAGE.RETRIEVED, HttpStatus.OK, "Update a post")
  updatePost(
    @Param() params: PublicIdParamsDto,
    @Body() payload: UpdatePostDto,
    @GetUserId() userId: string,
  ) {
    if (
      payload.content === undefined &&
      payload.isPinned === undefined &&
      payload.dateRangeFrom === undefined &&
      payload.dateRangeTo === undefined &&
      payload.scheduledTimeFrom === undefined &&
      payload.scheduledTimeTo === undefined
    ) {
      throw new BadRequestException("At least one update field is required");
    }
    return this.postActionService.update(
      params.publicId,
      userId,
      payload,
    );
  }

  @Delete(":publicId")
  @ApiBearerAuth("bearer")
  @ResponseOperation(POST_MESSAGE.RETRIEVED, HttpStatus.OK, "Delete a post")
  async deletePost(
    @Param() params: PublicIdParamsDto,
    @GetUserId() userId: string,
  ) {
    await this.postActionService.delete(params.publicId, userId);
    return { deleted: true };
  }

  private async getUser(username: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

}
