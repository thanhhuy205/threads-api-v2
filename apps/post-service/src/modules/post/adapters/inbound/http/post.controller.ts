import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { POST_MESSAGE } from '@purse/common/constants';
import {
  ApiCursorPaginatedResponse,
  CursorPagination,
  GetUserId,
  IsPublic,
  Message,
  ResponseOperation,
} from '@purse/common/decorators';
import type { CursorPagination as CursorPaginationParams } from '@purse/common/dto';
import { NotFoundException } from '@purse/common/errors';
import {
  CreatePostDto,
  NewsFeedQueryDto,
  PublicIdParamsDto,
  SearchPostQueryDto,
} from './dto/request';
import {
  POST_FEED_SERVICE,
  type PostFeedService,
} from '../../../application/use-cases/post-feed.service';
import {
  POST_SEARCH_SERVICE,
  type PostSearchService,
} from '../../../application/use-cases/post-search.service';
import { POST_SERVICE, type PostService } from '../../../application/use-cases/post.service';

type AuthenticatedRequest = {
  headers: { authorization?: string | string[] | undefined };
  user?: { sub?: string };
};

@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(
    @Inject(POST_SERVICE) private readonly postService: PostService,
    @Inject(POST_FEED_SERVICE)
    private readonly postFeedService: PostFeedService,
    @Inject(POST_SEARCH_SERVICE)
    private readonly postSearchService: PostSearchService,
  ) {}

  @Get('news-feed')
  @IsPublic()
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Get the news feed' })
  @ApiCursorPaginatedResponse({ description: POST_MESSAGE.RETRIEVED })
  async getNewsFeed(
    @Query() query: NewsFeedQueryDto,
    @CursorPagination() cursor: CursorPaginationParams,
    @Req() request: AuthenticatedRequest,
  ) {
    // MAINTENANCE: restore optional JWT extraction when the local auth adapter is ready.
    // const userId = await this.jwtService.requestAuthToken(request);
    const userId = null;
    const { posts, pagination } = await this.postFeedService.getNewsFeed({
      after: cursor.after ?? undefined,
      take: cursor.take,
      userId,
      type: query.type ?? 'for_you',
    });
    return { data: posts, pagination };
  }

  @Get('search')
  @IsPublic()
  @ResponseOperation(POST_MESSAGE.SEARCH_SUCCESS, HttpStatus.OK, 'Search posts')
  search(@Query() query: SearchPostQueryDto) {
    return this.postSearchService.search({
      q: query.q ?? '',
      topics: query.topics ?? '',
      limit: query.limit ?? '',
      page: query.page ?? '',
    });
  }

  @Get(':publicId')
  @IsPublic()
  @ResponseOperation(POST_MESSAGE.RETRIEVED, HttpStatus.OK, 'Get a post')
  @ApiParam({ name: 'publicId' })
  async getPost(
    @Param() params: PublicIdParamsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const post = await this.postFeedService.getById(
      params.publicId,
      // MAINTENANCE: await this.jwtService.requestAuthToken(request),
      undefined,
    );
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  @Post()
  @ApiBearerAuth('bearer')
  @ResponseOperation(POST_MESSAGE.CREATED, HttpStatus.CREATED, 'Create a post')
  createPost(@Body() payload: CreatePostDto, @GetUserId() userId: string) {
    return this.postService.create({
      ...payload,
      userId,
    });
  }
}
