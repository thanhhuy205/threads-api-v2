import { Controller, Get, Inject, Param, Query, Req } from '@nestjs/common';
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
} from '@purse/common/decorators';
import type { CursorPagination as CursorPaginationParams } from '@purse/common/dto';
import { NotFoundException } from '@purse/common/errors';
import {
  CursorPaginationQueryDto,
  UsernameParamsDto,
} from './dto/request';
import { USER_READER, type UserReader } from '../../../application/ports/outbound/user-reader.port';
import {
  POST_FEED_SERVICE,
  type PostFeedService,
} from '../../../application/ports/inbound/post-feed.service';
import {
  POST_USER_SERVICE,
  type PostUserService,
} from '../../../application/ports/inbound/post-user.service';

type AuthenticatedRequest = {
  headers: { authorization?: string | string[] | undefined };
  user?: { sub?: string };
};

@ApiTags('Post')
@Controller('posts')
export class PostUserController {
  constructor(
    @Inject(POST_FEED_SERVICE) private readonly postFeedService: PostFeedService,
    @Inject(POST_USER_SERVICE) private readonly postUserService: PostUserService,
    @Inject(USER_READER) private readonly userReader: UserReader,
  ) {}

  @Get('me')
  @ApiBearerAuth('bearer')
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Get current user posts' })
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

  @Get('me/replies')
  @ApiBearerAuth('bearer')
  @Message(POST_MESSAGE.REPLIES_RETRIEVED)
  @ApiOperation({ summary: 'Get current user replies' })
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

  /* MAINTENANCE: quote/repost views are temporarily disabled.
  @Get('me/quote')
  @ApiBearerAuth('bearer')
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Get current user quotes and reposts' })
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
  */

  @Get('user/:username')
  @IsPublic()
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Get posts by username' })
  @ApiParam({ name: 'username' })
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
      // MAINTENANCE: myUserId: (await this.jwtService.requestAuthToken(request)) ?? undefined,
      myUserId: undefined,
    });
    return { data: posts, pagination };
  }

  @Get('user/:username/replies')
  @IsPublic()
  @Message(POST_MESSAGE.REPLIES_RETRIEVED)
  @ApiOperation({ summary: 'Get replies by username' })
  @ApiParam({ name: 'username' })
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
      // MAINTENANCE: myUserId: (await this.jwtService.requestAuthToken(request)) ?? undefined,
      myUserId: undefined,
    });
    return { data: posts, pagination };
  }

  /* MAINTENANCE: quote/repost views are temporarily disabled.
  @Get('user/:username/quotes')
  @IsPublic()
  @Message(POST_MESSAGE.RETRIEVED)
  @ApiOperation({ summary: 'Get quotes and reposts by username' })
  @ApiParam({ name: 'username' })
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
  */

  private async getUser(username: string) {
    const user = await this.userReader.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
