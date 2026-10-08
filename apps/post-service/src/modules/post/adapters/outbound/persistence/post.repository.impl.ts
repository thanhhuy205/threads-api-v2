import { Injectable, Logger } from '@nestjs/common';
import { PostType, ReplyPermission, VisibilityPost } from '@purse/common/enums';
import { primaryPostTypes } from '../../../../../constants/post-type';
import { Prisma } from '../../../../../generated/prisma/client';
import { toTime } from '../../../../../helper/conver-date.helper';
import { PrismaService } from '../../../../../prisma/prisma.service';
import type {
  CreateQuoteData,
  CreateReplyData,
  CreateRepostData,
  CreateRepostPayload,
  RepositoryCreatePostPayload,
} from '../../../application/commands/create-post.command';
import type { UpdatePostCommand } from '../../../application/commands/update-post.command';
import type { PostRepositoryPort } from '../../../application/ports/outbound/persistence/post.repository.port';
import type { PostRecord, UserSnapshot } from '../../../application/result';
import { postFeedSelect, postSelectRepository } from '../../inbound/http/presenter/post.mapper';

@Injectable()
export class PrismaPostRepository implements PostRepositoryPort {
  private readonly logger = new Logger(PrismaPostRepository.name, { timestamp: true });

  constructor(private readonly prisma: PrismaService) { }
  private buildFeedSelect(userId?: string | null): typeof postFeedSelect {
    void userId;
    return postFeedSelect;

    /* MAINTENANCE: poll and authenticated relation enrichment.
    const select: Prisma.PostSelect = {
      ...postFeedSelect,
      poll: {
        select: {
          id: true,
          expiresAt: true,
          voteCount: true,
          isExpired: true,
          pollOptions: {
            select: {
              id: true,
              optionText: true,
              votesCount: true,
              ...(userId
                ? {
                  votes: {
                    where: {
                      userId,
                    },
                    select: {
                      pollOptionId: true,
                    },
                    take: 1,
                  },
                }
                : {}),
            },
            orderBy: {
              id: Prisma.SortOrder.asc,
            },
          },
        },
      },
    };

    return select as typeof postFeedSelect;
    */
  }

  findAll({
    after,
    take,
    where,
    props: { userId, orderBy },
  }: {
    after?: string;
    take: number;
    where?: Prisma.PostWhereInput;
    props: { orderBy?: any; userId?: string | null };
  }) {
    const sortOrder = orderBy ?? [{ createdAt: "desc" }, { id: "desc" }];

    this.logger.log(`${JSON.stringify(where)}`);
    this.logger.log(
      `Finding posts with where: ${where ? JSON.stringify(where) : "none"}, orderBy: ${JSON.stringify(sortOrder)}, limit: ${take}, after: ${after ? 1 : 0}`,
    );
    return this.prisma.post.findMany({
      where: { AND: [{ deletedAt: null }, where ?? {}] },
      orderBy: sortOrder,
      take: after ? take + 1 : take,
      skip: after ? 1 : 0,
      cursor: after ? { publicId: after } : undefined,
      select: this.buildFeedSelect(userId),
    });

    /* MAINTENANCE: hidden/saved/liked/repost relation enrichment.
    return this.prisma.post.findMany({
      where: {
        AND: [
          { deletedAt: null },
          userId
            ? {
              postInteractions: {
                none: {
                  userId,
                  type: InteractionType.HIDE,
                },
              },
            }
            : {},
          where ?? {},
        ],
      },
      orderBy: sortOrder,
      take: after ? take + 1 : take,
      skip: after ? 1 : 0,
      cursor: after
        ? {
          publicId: after,
        }
        : undefined,
      select: {
        ...this.buildFeedSelect(userId),
        _count: {
          select: {
            children: true,
            derivatives: true,
          },
        },
        ...(userId
          ? {
            likes: {
              where: {
                userId: userId,
                isLike: true,
              },
              select: {
                userId: true,
              },
              take: 1,
            },
            derivatives: {
              where: {
                isQuote: true,
                userId: userId,
              },
              select: {
                publicId: true,
                userId: true,
              },
              take: 1,
            },
            postInteractions: {
              where: {
                userId: userId,
                type: InteractionType.SAVE,
              },
              select: {
                userId: true,
              },
              take: 1,
            },
          }
          : {}),
      },
    });
    */
  }

  count({ where = {} }: { where?: Prisma.PostWhereInput } = {}) {
    return this.prisma.post.count({
      where: {
        AND: [{ deletedAt: null }, where],
      },
    });
  }

  countPostBydUserId(userId: string) {
    return this.prisma.post.count({
      where: {
        deletedAt: null,
        userId,
        type: { in: [...primaryPostTypes] },
      },
    });
  }

  findCursorInfo({
    publicId,
    where,
  }: {
    publicId: string;
    where?: Prisma.PostWhereInput;
  }) {
    return this.prisma.post.findFirst({
      where: {
        AND: [{ deletedAt: null }, where ?? {}, { publicId }],
      },
      select: {
        id: true,
        createdAt: true,
      },
    });
  }

  private createPoll(polls?: string[]) {
    const options = polls
      ?.map((poll) => poll.trim())
      .filter((poll) => poll.length > 0);

    if (!options?.length) {
      return undefined;
    }

    return {
      create: {
        expiresAt: this.getPollExpiresAt(),
        pollOptions: {
          create: options.map((optionText) => ({
            optionText,
          })),
        },
      },
    };
  }

  private getPollExpiresAt() {
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  private baseData(
    payload: RepositoryCreatePostPayload,
    userSnapshot: UserSnapshot,
  ) {
    return {
      content: payload.content,
      userId: payload.userId,
      type: payload.type ?? PostType.POST,
      replyPermission: ReplyPermission.EVERYONE,
      visibility: VisibilityPost.WORKSPACE,
      userSnapshot,
      isSurvey: Boolean(payload.isSurvey || payload.polls?.length),
      // MAINTENANCE: poll: this.createPoll(payload.polls),
    };
  }
  async create(
    payload: RepositoryCreatePostPayload,
    userSnapshot: UserSnapshot,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<PostRecord> {
    const post = await tx.post.create({
      data: {
        ...this.baseData(payload, userSnapshot),
        contentJson: payload.contentJson,
        visibility: payload.visibility ?? VisibilityPost.WORKSPACE,
        isPinned: payload.isPinned ?? false,
        dateRangeFrom: payload.dateRangeFrom,
        dateRangeTo: payload.dateRangeTo,
        scheduledTimeFrom: toTime(payload.scheduledTimeFrom),
        scheduledTimeTo: toTime(payload.scheduledTimeTo),
        groupTeamId: payload.groupTeamId,
      },

      select: postSelectRepository,
    });

    return {
      id: post.id,
      publicId: post.publicId,
      content: post.content,
      contentJson: post.contentJson,
      userId: post.userId,
      type: post.type,
      visibility: post.visibility,
      isPinned: post.isPinned,
      dateRangeFrom: post.dateRangeFrom,
      dateRangeTo: post.dateRangeTo,
      scheduledTimeFrom: post.scheduledTimeFrom,
      scheduledTimeTo: post.scheduledTimeTo,
      groupTeamId: post.groupTeamId,
      createdAt: post.createdAt.toISOString(),
    };
  }

  async createReply(
    payload: RepositoryCreatePostPayload,
    {
      parentPostId,
      parentPublicId,
      rootPostId,
      rootPublicId,
      userSnapshot,
    }: CreateReplyData,
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    const post = await tx.post.create({
      data: {
        ...this.baseData(payload, userSnapshot),
        parentId: parentPostId,
        parentPublicId,
        rootPostId,
        rootPublicId,
        type: PostType.POST,
      },
      select: postSelectRepository,
    });

    return {
      id: post.id,
      publicId: post.publicId,
      content: post.content!,
      contentJson: post.contentJson,
      userId: post.userId,
      type: post.type,
      visibility: post.visibility,
      createdAt: post.createdAt.toISOString(),
    };
  }

  async createRepost(
    payload: CreateRepostPayload,
    {
      originPublicId,
      originPostId,
      userSnapshot,
    }: CreateRepostData,
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    const post = await tx.post.create({
      data: {
        ...this.baseData(
          {
            ...payload,
            content: payload.content ?? "",
            contentJson: "",
          },
          userSnapshot,
        ),
        originPublicId,
        isQuote: false,
        type: PostType.POST,
        originPostId,
      },
      select: postSelectRepository,
    });

    return {
      id: post.id,
      publicId: post.publicId,
      content: post.content,
      contentJson: post.contentJson,
      userId: post.userId,
      type: post.type,
      visibility: post.visibility,
      createdAt: post.createdAt.toISOString(),
    };
  }

  async createQuote(
    payload: RepositoryCreatePostPayload,
    {
      originPublicId,
      originPostId,
      userSnapshot,
    }: CreateQuoteData,
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    const post = await tx.post.create({
      data: {
        ...this.baseData(payload, userSnapshot),
        isQuote: true,
        type: PostType.POST,
        originPostId,
        originPublicId,
      },
      select: postSelectRepository,
    });

    return {
      id: post.id,
      publicId: post.publicId,
      content: post.content!,
      contentJson: post.contentJson,
      userId: post.userId,
      type: post.type,
      visibility: post.visibility,
      createdAt: post.createdAt.toISOString(),
    };
  }

  async list(): Promise<PostRecord[]> {
    const posts = await this.prisma.post.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: {
        publicId: true,
        content: true,
        userId: true,
        type: true,
        visibility: true,
        createdAt: true,
      },
    });

    return posts.map((post) => ({
      publicId: post.publicId,
      content: post.content,
      userId: post.userId,
      type: post.type,
      visibility: post.visibility,
      createdAt: post.createdAt.toISOString(),
    }));
  }
  async findByPublicId(publicId: string, userId?: string | null) {
    return this.prisma.post.findFirst({
      where: { publicId, deletedAt: null },
      select: { id: true, ...this.buildFeedSelect(userId) },
    });

    /* MAINTENANCE: saved-state relation enrichment.
    return this.prisma.post.findFirst({
      where: { publicId, deletedAt: null },
      select: {
        id: true,
        ...this.buildFeedSelect(userId),
        ...(userId
          ? {
            postInteractions: {
              where: {
                userId,
                type: InteractionType.SAVE,
              },
              select: {
                userId: true,
              },
              take: 1,
            },
          }
          : {}),
      },
    });
    */
  }

  countRepliesByPostPublicId(publicId: string): Promise<number> {
    return this.prisma.post.count({
      where: {
        parentPublicId: publicId,
        deletedAt: null,
      },
    });
  }

  async findFirstRepliesByPostPublicId(count: number, publicId: string) {

    return this.prisma.post.findMany({
      where: {
        parentPublicId: publicId,
        deletedAt: null,
      },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      take: count,
      select: {
        id: true,
        publicId: true,
        content: true,
        userId: true,
        userSnapshot: true,
        createdAt: true,
      },
    });
  }

  async findExisting(publicId: string) {
    return this.prisma.post.findFirst({
      where: { publicId },
      select: {
        likesCount: true,
      }
    })
  }
  async findById(id: number) {
    return this.prisma.post.findFirst({
      where: { id, deletedAt: null },
      select: {
        publicId: true,
      }
    });
  }
  async findByIds(ids: number[]) {
    if (!ids.length) {
      return [];
    }

    return this.prisma.post.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      select: {
        id: true,
        publicId: true,
        content: true,
        userSnapshot: true,
        createdAt: true,
      },
    });
  }

  async findOriginReferenceByPublicId(publicId: string) {
    return this.prisma.post.findFirst({
      where: { publicId, deletedAt: null },
      select: {
        id: true,
        publicId: true,
        userId: true,
        rootPostId: true,
        rootPublicId: true,
        originPostId: true,
        originPublicId: true,
      },
    });
  }

  async findDeleteTargetByPublicId(publicId: string) {
    return this.prisma.post.findFirst({
      where: {
        publicId,
        deletedAt: null,
      },
      select: {
        publicId: true,
        userId: true,
        type: true,
      },
    });
  }


  async updateByPublicId(
    publicId: string,
    payload: UpdatePostCommand,
  ): Promise<PostRecord> {
    const post = await this.prisma.post.update({
      where: { publicId },
      data: {
        content: payload.content,
        isPinned: payload.isPinned,
        dateRangeFrom: payload.dateRangeFrom,
        dateRangeTo: payload.dateRangeTo,
        scheduledTimeFrom:
          payload.scheduledTimeFrom === undefined
            ? undefined
            : toTime(payload.scheduledTimeFrom),
        scheduledTimeTo:
          payload.scheduledTimeTo === undefined
            ? undefined
            : toTime(payload.scheduledTimeTo),
      },
      select: {
        publicId: true,
        content: true,
        userId: true,
        type: true,
        visibility: true,
        isPinned: true,
        dateRangeFrom: true,
        dateRangeTo: true,
        scheduledTimeFrom: true,
        scheduledTimeTo: true,
        groupTeamId: true,
        createdAt: true,
      },
    });

    return {
      publicId: post.publicId,
      content: post.content,
      userId: post.userId,
      type: post.type,
      visibility: post.visibility,
      isPinned: post.isPinned,
      dateRangeFrom: post.dateRangeFrom,
      dateRangeTo: post.dateRangeTo,
      scheduledTimeFrom: post.scheduledTimeFrom,
      scheduledTimeTo: post.scheduledTimeTo,
      groupTeamId: post.groupTeamId,
      createdAt: post.createdAt.toISOString(),
    };
  }


  async softDeleteByPublicId(publicId: string): Promise<void> {
    await this.prisma.post.update({
      where: { publicId },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // TĂNG count + lấy chủ post
  async incrementLikedCount(publicId: string, count: number): Promise<{ likesCount: number; ownerId: string }> {
    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
      UPDATE posts
      SET likes_count = GREATEST(likes_count + ${count}, 0)
      WHERE public_id = ${publicId}
    `
      const rows = await tx.$queryRaw<{ likes_count: number; user_id: string }[]>`
      SELECT likes_count, user_id
      FROM posts
      WHERE public_id = ${publicId}
    `
      return { likesCount: rows[0].likes_count, ownerId: rows[0].user_id }
    })
  }


  async searchByContent({
    q,
    after,
    take = 20,
    userId,
  }: {
    q: string;
    after?: string;
    take?: number;
    userId?: string;
  }) {
    const cursor = after ?? null;
    const matches = await this.prisma.$queryRaw<{ publicId: string }[]>`
      SELECT p.public_id AS publicId
      FROM posts p
      LEFT JOIN posts cursor_post ON cursor_post.public_id = ${cursor}
      WHERE MATCH(p.content) AGAINST (${q} IN BOOLEAN MODE)
        AND p.type IN (${Prisma.join(primaryPostTypes)})
        AND p.deleted_at IS NULL
        AND p.visibility = ${VisibilityPost.WORKSPACE}
        AND (
          ${cursor} IS NULL
          OR p.created_at < cursor_post.created_at
          OR (p.created_at = cursor_post.created_at AND p.id < cursor_post.id)
        )
      ORDER BY p.created_at DESC, p.id DESC
      LIMIT ${take + 1}
    `;

    const publicIds = matches.map((post) => post.publicId);
    if (!publicIds.length) {
      return [];
    }

    const posts = await this.prisma.post.findMany({
      where: {
        publicId: { in: publicIds },
        type: { in: [...primaryPostTypes] },
        deletedAt: null,
        visibility: VisibilityPost.WORKSPACE,
      },
      select: this.buildFeedSelect(userId),
    });

    /* MAINTENANCE: hidden/saved/liked/repost relation enrichment.
    const enrichedPosts = await this.prisma.post.findMany({
      where: {
        publicId: {
          in: publicIds,
        },
        type: { in: [...primaryPostTypes] },
        deletedAt: null,
        visibility: VisibilityPost.WORKSPACE,
        ...(userId
          ? {
            postInteractions: {
              none: {
                userId,
                type: InteractionType.HIDE,
              },
            },
          }
          : {}),
      },
      select: {
        ...this.buildFeedSelect(userId),
        _count: {
          select: {
            children: true,
            derivatives: true,
          },
        },
        ...(userId
          ? {
            likes: {
              where: {
                userId,
                isLike: true,
              },
              select: {
                userId: true,
              },
              take: 1,
            },
            derivatives: {
              where: {
                isQuote: true,
                userId,
              },
              select: {
                publicId: true,
                userId: true,
              },
              take: 1,
            },
            postInteractions: {
              where: {
                userId,
                type: InteractionType.SAVE,
              },
              select: {
                userId: true,
              },
              take: 1,
            },
          }
          : {}),
      },
    });
    */

    const postsByPublicId = new Map(
      posts.map((post) => [post.publicId, post]),
    );

    return publicIds
      .map((publicId) => postsByPublicId.get(publicId))
      .filter((post): post is NonNullable<typeof post> => Boolean(post));
  }

  async applyLikeCountDelta(
    publicId: string,
    delta: number,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    await tx.$executeRaw`
      UPDATE posts
      SET likes_count = GREATEST(likes_count + ${delta}, 0)
      WHERE public_id = ${publicId}
    `;
  }

  async findLikeCountSnapshot(
    publicId: string,
    tx: Prisma.TransactionClient,
  ): Promise<{ likesCount: number; ownerId: string }> {
    const post = await tx.post.findUniqueOrThrow({
      where: {
        publicId,
      },
      select: {
        likesCount: true,
        userId: true,
      },
    });

    return {
      likesCount: post.likesCount,
      ownerId: post.userId,
    };
  }

  async increaseLikeCount(publicId: string, count: number): Promise<void> {
    await this.prisma.$executeRaw`
      UPDATE posts
      SET likes_count = GREATEST(likes_count + ${count}, 0)
      WHERE public_id = ${publicId}
    `;
  }

  async decreaseLikeCount(publicId: string, count: number): Promise<void> {
    await this.prisma.$executeRaw`
      UPDATE posts
      SET likes_count = GREATEST(likes_count - ${count}, 0)
      WHERE public_id = ${publicId}
    `;
  }

}

