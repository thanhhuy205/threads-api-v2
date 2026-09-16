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
import {
  CreatePostDto,
  CursorPaginationQueryDto,
  PublicIdParamsDto,
} from '../dto/request';
import {
  POST_ACTION_SERVICE,
  type PostActionService,
} from '../service/post-action.service';
import {
  POST_FEED_SERVICE,
  type PostFeedService,
} from '../service/post-feed.service';
import { POST_SERVICE, type PostService } from '../service/post.service';

type AuthenticatedRequest = {
  headers: { authorization?: string | string[] | undefined };
  user?: { sub?: string };
};

@ApiTags('Post')
@Controller('posts')
export class PostActionController {
  constructor(
    @Inject(POST_SERVICE) private readonly postService: PostService,
    @Inject(POST_ACTION_SERVICE)
    private readonly postActionService: PostActionService,
    @Inject(POST_FEED_SERVICE) private readonly postFeedService: PostFeedService,
  ) {}

  @Get(':publicId/replies')
  @IsPublic()
  @Message(POST_MESSAGE.REPLIES_RETRIEVED)
  @ApiOperation({ summary: 'Get replies to a post' })
  @ApiParam({ name: 'publicId' })
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
      // MAINTENANCE: userId: await this.jwtService.requestAuthToken(request),
      userId: undefined,
    });
    return { data: posts, pagination };
  }

  @Post(':publicId/reply')
  @ApiBearerAuth('bearer')
  @ResponseOperation(POST_MESSAGE.CREATED, HttpStatus.CREATED, 'Reply to a post')
  @ApiParam({ name: 'publicId' })
  replyPost(
    @Param() params: PublicIdParamsDto,
    @Body() payload: CreatePostDto,
    @GetUserId() userId: string,
  ) {
    return this.postService.reply(params.publicId, { ...payload, userId });
  }

  @Post(':publicId/like')
  @ApiBearerAuth('bearer')
  @ResponseOperation(
    POST_MESSAGE.RETRIEVED,
    HttpStatus.OK,
    'Like or unlike a post',
  )
  async likePost(
    @Param() params: PublicIdParamsDto,
    @GetUserId() userId: string,
  ) {
    return {
      liked: await this.postActionService.like(params.publicId, userId),
    };
  }

  /* MAINTENANCE: repost and quote creation are temporarily disabled.
  @Post(':publicId/repost')
  @ApiBearerAuth('bearer')
  @ResponseOperation(POST_MESSAGE.CREATED, HttpStatus.CREATED, 'Repost a post')
  repostPost(
    @Param() params: PublicIdParamsDto,
    @GetUserId() userId: string,
  ) {
    return this.postService.repost(params.publicId, userId);
  }

  @Post(':publicId/quote')
  @ApiBearerAuth('bearer')
  @ResponseOperation(POST_MESSAGE.CREATED, HttpStatus.CREATED, 'Quote a post')
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
  */

  /* MAINTENANCE: save/hide/update/delete actions are temporarily disabled.
  @Post(':publicId/save')
  @ApiBearerAuth('bearer')
  @ResponseOperation(POST_MESSAGE.RETRIEVED, HttpStatus.OK, 'Save or unsave a post')
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

  @Post(':publicId/hide')
  @ApiBearerAuth('bearer')
  @ResponseOperation(POST_MESSAGE.RETRIEVED, HttpStatus.OK, 'Hide or unhide a post')
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

  @Patch(':publicId')
  @ApiBearerAuth('bearer')
  @ResponseOperation(POST_MESSAGE.RETRIEVED, HttpStatus.OK, 'Update a post')
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
      throw new BadRequestException('At least one update field is required');
    }
    return this.postActionService.update(
      params.publicId,
      userId,
      payload,
    );
  }

  @Delete(':publicId')
  @ApiBearerAuth('bearer')
  @ResponseOperation(POST_MESSAGE.RETRIEVED, HttpStatus.OK, 'Delete a post')
  async deletePost(
    @Param() params: PublicIdParamsDto,
    @GetUserId() userId: string,
  ) {
    await this.postActionService.delete(params.publicId, userId);
    return { deleted: true };
  }
  */
}
