import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Message } from '@/common/decorators/message.decorator';
import { Pagination } from '@/common/decorators/pagination.decorator';
import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { AUTH_MESSAGE, POST_MESSAGE } from '@/constants/message';
import { NotFoundException, UnauthorizedException } from '@/errors/error';
import { JwtService } from '@/modules/jwt/service/jwt.service';
import { UserService } from '@/modules/user/service/user.service';
import { buildPagination } from '@/shared/pagination/cursor-pagination';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { CursorPaginationQueryDto, HidePostDto, NewsFeedQueryDto, PublicIdParamsDto, ReportDto, SavePostDto, SearchPostQueryDto, UsernameParamsDto } from '../dto/request/post.request';
import { PostActionService } from '../service/post-action.service';
import { PostFeedService } from '../service/post-feed.service';
import { PostSearchService } from '../service/post-search.service';
import { PostUserService } from '../service/post-user.service';
import { PostService } from '../service/post.service';

type AuthenticatedRequest = {
  headers: { authorization?: string | string[] | undefined };
  user?: { sub?: string };
};

@ApiTags('Post')
@Controller('posts')
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

  @Get('news-feed')
  @Pagination()
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Get the news feed' })
  @ApiResponse({ status: HttpStatus.OK, description: POST_MESSAGE.RETRIEVED })
  async getNewsFeed(@Query() query: NewsFeedQueryDto, @Req() request: AuthenticatedRequest) {
    const { currentAfter, currentLimit } = buildPagination(query);
    const userId = await this.jwtService.requestAuthToken(request);
    const { posts, pagination } = await this.postFeedService.getNewsFeed({
      after: currentAfter ?? undefined,
      take: currentLimit,
      userId,
      feedType: query.type,
    });
    return { data: posts, pagination };
  }

  @Get('search')
  @Message(POST_MESSAGE.SEARCH_SUCCESS)
  @ApiOperation({ summary: 'Search posts' })
  @ApiResponse({ status: HttpStatus.OK, description: POST_MESSAGE.SEARCH_SUCCESS })
  search(@Query() query: SearchPostQueryDto) {
    return this.postSearchService.search({
      q: query.q ?? '',
      topics: query.topics ?? '',
      limit: query.limit ?? '',
      page: query.page ?? '',
    });
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('bearer')
  @Pagination()
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Get current user posts' })
  @ApiResponse({ status: HttpStatus.OK, description: POST_MESSAGE.RETRIEVED })
  async getPostMe(@Query() query: CursorPaginationQueryDto, @Req() request: AuthenticatedRequest) {
    const { currentAfter, currentLimit } = buildPagination(query);
    const { posts, pagination } = await this.postFeedService.getPostMe({
      after: currentAfter ?? undefined,
      take: currentLimit,
      userId: this.userId(request),
    });
    return { data: posts, pagination };
  }

  @Get('me/replies')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('bearer')
  @Pagination()
  @Message(POST_MESSAGE.REPLIES_RETRIEVED)
  @ApiOperation({ summary: 'Get current user replies' })
  @ApiResponse({ status: HttpStatus.OK, description: POST_MESSAGE.REPLIES_RETRIEVED })
  async getRepliesMe(@Query() query: CursorPaginationQueryDto, @Req() request: AuthenticatedRequest) {
    const { currentAfter, currentLimit } = buildPagination(query);
    const userId = this.userId(request);
    const { posts, pagination } = await this.postUserService.getRepliesByUser({
      after: currentAfter ?? undefined,
      take: currentLimit,
      userId,
      myUserId: userId,
    });
    return { data: posts, pagination };
  }

  @Get('me/quote')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('bearer')
  @Pagination()
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Get current user quotes and reposts' })
  @ApiResponse({ status: HttpStatus.OK, description: POST_MESSAGE.RETRIEVED })
  async getQuoteMe(@Query() query: CursorPaginationQueryDto, @Req() request: AuthenticatedRequest) {
    const { currentAfter, currentLimit } = buildPagination(query);
    const userId = this.userId(request);
    const { posts, pagination } = await this.postFeedService.getQuote({
      after: currentAfter ?? undefined,
      take: currentLimit,
      userId,
      myUserId: userId,
    });
    return { data: posts, pagination };
  }

  @Get('user/:username')
  @Pagination()
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Get posts by username' })
  @ApiParam({ name: 'username' })
  @ApiResponse({ status: HttpStatus.OK, description: POST_MESSAGE.RETRIEVED })
  async getPostsByUser(@Param() params: UsernameParamsDto, @Query() query: CursorPaginationQueryDto, @Req() request: AuthenticatedRequest) {
    const user = await this.getUser(params.username);
    const { currentAfter, currentLimit } = buildPagination(query);
    const { posts, pagination } = await this.postUserService.getPostsByUser({
      after: currentAfter ?? undefined, take: currentLimit, userId: user.id,
      myUserId: await this.jwtService.requestAuthToken(request) ?? undefined,
    });
    return { data: posts, pagination };
  }

  @Get('user/:username/replies')
  @Pagination()
  @Message(POST_MESSAGE.REPLIES_RETRIEVED)
  @ApiOperation({ summary: 'Get replies by username' })
  @ApiParam({ name: 'username' })
  @ApiResponse({ status: HttpStatus.OK, description: POST_MESSAGE.REPLIES_RETRIEVED })
  async getRepliesByUser(@Param() params: UsernameParamsDto, @Query() query: CursorPaginationQueryDto, @Req() request: AuthenticatedRequest) {
    const user = await this.getUser(params.username);
    const { currentAfter, currentLimit } = buildPagination(query);
    const { posts, pagination } = await this.postUserService.getRepliesByUser({
      after: currentAfter ?? undefined, take: currentLimit, userId: user.id,
      myUserId: await this.jwtService.requestAuthToken(request) ?? undefined,
    });
    return { data: posts, pagination };
  }

  @Get('user/:username/quotes')
  @Pagination()
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Get quotes and reposts by username' })
  @ApiParam({ name: 'username' })
  @ApiResponse({ status: HttpStatus.OK, description: POST_MESSAGE.RETRIEVED })
  async getQuote(@Param() params: UsernameParamsDto, @Query() query: CursorPaginationQueryDto, @Req() request: AuthenticatedRequest) {
    const user = await this.getUser(params.username);
    const { currentAfter, currentLimit } = buildPagination(query);
    const { posts, pagination } = await this.postFeedService.getQuote({
      after: currentAfter ?? undefined, take: currentLimit, userId: user.id,
      myUserId: await this.jwtService.requestAuthToken(request) ?? undefined,
    });
    return { data: posts, pagination };
  }

  @Get(':publicId/replies')
  @Pagination()
  @Message(POST_MESSAGE.REPLIES_RETRIEVED)
  @ApiOperation({ summary: 'Get replies to a post' })
  @ApiParam({ name: 'publicId' })
  @ApiResponse({ status: HttpStatus.OK, description: POST_MESSAGE.REPLIES_RETRIEVED })
  async getReplies(@Param() params: PublicIdParamsDto, @Query() query: CursorPaginationQueryDto, @Req() request: AuthenticatedRequest) {
    const { currentAfter, currentLimit } = buildPagination(query);
    const { posts, pagination } = await this.postFeedService.getReplies({
      after: currentAfter ?? undefined, take: currentLimit, publicId: params.publicId,
      userId: await this.jwtService.requestAuthToken(request),
    });
    return { data: posts, pagination };
  }

  @Get(':publicId')
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Get a post' })
  @ApiParam({ name: 'publicId' })
  @ApiResponse({ status: HttpStatus.OK, description: POST_MESSAGE.RETRIEVED })
  async getPost(@Param() params: PublicIdParamsDto, @Req() request: AuthenticatedRequest) {
    const post = await this.postFeedService.getById(params.publicId, await this.jwtService.requestAuthToken(request));
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('bearer')
  @Message(POST_MESSAGE.CREATED)
  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: POST_MESSAGE.CREATED })
  createPost(@Body() payload: CreatePostDto, @Req() request: AuthenticatedRequest) {
    return this.postService.create({ ...payload, userId: this.userId(request) });
  }

  @Post(':publicId/reply')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('bearer')
  @Message(POST_MESSAGE.CREATED)
  @ApiOperation({ summary: 'Reply to a post' })
  @ApiParam({ name: 'publicId' })
  replyPost(@Param() params: PublicIdParamsDto, @Body() payload: CreatePostDto, @Req() request: AuthenticatedRequest) {
    return this.postService.reply(params.publicId, { ...payload, userId: this.userId(request) });
  }

  @Post(':publicId/like')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Like or unlike a post' })
  async likePost(@Param() params: PublicIdParamsDto, @Req() request: AuthenticatedRequest) {
    return { liked: await this.postActionService.like(params.publicId, this.userId(request)) };
  }

  @Post(':publicId/repost')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('bearer')
  @Message(POST_MESSAGE.CREATED)
  @ApiOperation({ summary: 'Repost a post' })
  repostPost(@Param() params: PublicIdParamsDto, @Req() request: AuthenticatedRequest) {
    return this.postService.repost(params.publicId, this.userId(request));
  }

  @Post(':publicId/quote')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('bearer')
  @Message(POST_MESSAGE.CREATED)
  @ApiOperation({ summary: 'Quote a post' })
  quotePost(@Param() params: PublicIdParamsDto, @Body() payload: CreatePostDto, @Req() request: AuthenticatedRequest) {
    return this.postService.quote(params.publicId, { ...payload, userId: this.userId(request) });
  }

  @Post(':publicId/save')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Save or unsave a post' })
  async savePost(@Param() params: PublicIdParamsDto, @Body() payload: SavePostDto, @Req() request: AuthenticatedRequest) {
    await this.postActionService.save(params.publicId, this.userId(request), payload.isSaved);
    return { saved: payload.isSaved };
  }

  @Post(':publicId/hide')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Hide or unhide a post' })
  async hidePost(@Param() params: PublicIdParamsDto, @Body() payload: HidePostDto, @Req() request: AuthenticatedRequest) {
    await this.postActionService.hide(params.publicId, this.userId(request), payload.isHidden);
    return { hidden: payload.isHidden };
  }

  @Post(':publicId/report')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Report a post or user' })
  async reportPost(@Param() params: PublicIdParamsDto, @Body() payload: ReportDto, @Req() request: AuthenticatedRequest) {
    const report = await this.postActionService.report(params.publicId, { ...payload, reporterId: this.userId(request) });
    return { reported: true, report };
  }

  @Patch(':publicId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('bearer')
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Update a post' })
  updatePost(@Param() params: PublicIdParamsDto, @Body() payload: UpdatePostDto, @Req() request: AuthenticatedRequest) {
    if (payload.content === undefined && payload.visibility === undefined) {
      throw new BadRequestException('At least one of content or visibility is required');
    }
    return this.postActionService.update(params.publicId, this.userId(request), payload);
  }

  @Delete(':publicId')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Delete a post' })
  async deletePost(@Param() params: PublicIdParamsDto, @Req() request: AuthenticatedRequest) {
    await this.postActionService.delete(params.publicId, this.userId(request));
    return { deleted: true };
  }

  private async getUser(username: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private userId(request: AuthenticatedRequest): string {
    if (!request.user?.sub) throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    return request.user.sub;
  }
}
