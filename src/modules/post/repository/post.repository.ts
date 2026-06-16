import prisma from "@/config/prisma";
import { baseLogger } from "@/middlewares/logger";
import type {
  CreatePostPayload
} from "@/modules/post/interfaces/create-post-payload";
import {
  postFeedSelect,
  postSelectRepository,
} from "@/modules/post/selector/post.selector";
import {
  PostMediaStatus,
  PostMediaType,
  PostType,
  Prisma,
  ReplyPermission,
  VisibilityPost,
} from "@prisma/client";
import { UpdatePostDto } from "../dto/post.dto";
import { UserSnapshot } from "../mapper/post.mapper";

import { v4 as uuidv4 } from "uuid";

export type PostRecord = {
  id?: number;
  publicId: string;
  content: string;
  contentJson?: Prisma.JsonValue;
  userId: string;
  visibility: VisibilityPost;
  isDisinformation: boolean;
  createdAt: string;
};

type RepositoryCreatePostPayload = Omit<CreatePostPayload, "isSurvey"> & {
  isSurvey?: boolean;
  type?: PostType;
};

type CreateRepostPayload = {
  userId: string;
  content?: string;
  replyPermission?: ReplyPermission;
  visibility?: VisibilityPost;
};

class PostRepository implements ICursorPagination<Prisma.PostWhereInput, any> {
  private buildFeedSelect(userId?: string | null): Prisma.PostSelect {
    const select: Prisma.PostSelect = {
      ...postFeedSelect,
      polls: {
        select: {
          id: true,
          expiresAt: true,
          _count: {
            select: {
              votes: true,
            },
          },
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
        orderBy: {
          id: Prisma.SortOrder.asc,
        },
      },
    };

    return select;
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

    baseLogger.info(`${JSON.stringify(where)}`);
    baseLogger.info(
      `Finding posts with where: ${where ? JSON.stringify(where) : "none"}, orderBy: ${JSON.stringify(sortOrder)}, limit: ${take}, after: ${after ? 1 : 0}`,
    );
    return prisma.post.findMany({
      where: {
        AND: [{ isDeleted: false }, { isHidden: false }, where ?? {}],
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
            }
          }
          : {}),
      },
    });
  }

  count({ where = {} }: { where?: Prisma.PostWhereInput } = {}) {
    return prisma.post.count({
      where: {
        AND: [{ isDeleted: false }, where],
      },
    });
  }

  countPostBydUserId(userId: string) {
    return prisma.post.count({
      where: {
        isDeleted: false,
        userId,
        type: PostType.POST,
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
    return prisma.post.findFirst({
      where: {
        AND: [{ isDeleted: false }, where ?? {}, { publicId }],
      },
      select: {
        id: true,
        createdAt: true,
      },
    });
  }
  private connectMedia(media?: { id: number }[]) {
    return media?.length
      ? { connect: media.map((m) => ({ id: m.id })) }
      : undefined;
  }

  private resolveContentJson(contentJson?: unknown): Prisma.InputJsonValue | undefined {
    if (contentJson === undefined) {
      return undefined;
    }

    return contentJson as Prisma.InputJsonValue;
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
      replyPermission: payload.replyPermission ?? ReplyPermission.EVERYONE,
      visibility: payload.visibility ?? VisibilityPost.PUBLIC,
      userSnapshot,
      isSurvey: Boolean(payload.isSurvey || payload.polls?.length),
      polls: this.createPoll(payload.polls),
      media: this.connectMedia(payload.media),
    };
  }
  async create(
    payload: RepositoryCreatePostPayload,
    userSnapshot: UserSnapshot,
    tx: Prisma.TransactionClient = prisma,
  ): Promise<PostRecord> {
    const post = await tx.post.create({
      data: {
        ...this.baseData(payload, userSnapshot),
      },

      select: postSelectRepository,
    });

    return {
      id: post.id,
      publicId: post.publicId,
      content: post.content,
      contentJson: post.contentJson,
      userId: post.userId,
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt.toISOString(),
    };
  }

  async createReply(
    payload: RepositoryCreatePostPayload,
    parent: { id: number; publicId: string },
    userSnapshot: UserSnapshot,
    tx: Prisma.TransactionClient = prisma,
  ) {
    const post = await tx.post.create({
      data: {
        ...this.baseData(payload, userSnapshot),
        parentId: parent.id,
        parentPublicId: parent.publicId,
        type: PostType.REPLY,
      },
      select: postSelectRepository,
    });

    return {
      id: post.id,
      publicId: post.publicId,
      content: post.content!,
      contentJson: post.contentJson,
      userId: post.userId,
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt.toISOString(),
    };
  }

  async createCircle(
    payload: {
      contentJson?: unknown;
      content: string;
      type?: PostType;
      replyPermission?: ReplyPermission;
      visibility?: VisibilityPost;
    },
    userSnapshot: UserSnapshot,
    tx: Prisma.TransactionClient = prisma,
  ) {
    const post = await tx.post.create({
      data: {
        userId: userSnapshot.id,
        content: payload.content,
        contentJson: this.resolveContentJson(payload.contentJson),
        userSnapshot,
        replyPermission: payload.replyPermission ?? ReplyPermission.EVERYONE,
        visibility: payload.visibility ?? VisibilityPost.PUBLIC,
        type: PostType.CIRCLE,
      },
      select: postSelectRepository
    });
    return {
      id: post.id,
      publicId: post.publicId,
      content: post.content!,
      contentJson: post.contentJson,
      userId: post.userId,
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt.toISOString(),
    };
  }

  async createCircleReply(
    payload: RepositoryCreatePostPayload,
    parent: { id: number; publicId: string },
    userSnapshot: UserSnapshot,
    tx: Prisma.TransactionClient = prisma,
  ) {
    const post = await tx.post.create({
      data: {
        ...this.baseData(payload, userSnapshot),
        parentId: parent.id,
        parentPublicId: parent.publicId,
        type: PostType.CIRCLE_REPLY,
      },
      select: postSelectRepository,
    });

    return {
      id: post.id,
      publicId: post.publicId,
      content: post.content!,
      contentJson: post.contentJson,
      userId: post.userId,
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt.toISOString(),
    };
  }

  async createRepost(
    payload: CreateRepostPayload,
    originPublicId: string,
    userSnapshot: UserSnapshot,
    originPostId: number,
    tx: Prisma.TransactionClient = prisma,
  ) {
    const post = await tx.post.create({
      data: {
        ...this.baseData(
          {
            ...payload,
            content: payload.content ?? "",
            visibility: payload.visibility ?? VisibilityPost.PUBLIC,
            replyPermission: payload.replyPermission ?? ReplyPermission.EVERYONE,
          },
          userSnapshot,
        ),
        originPublicId: originPublicId,
        isQuote: true,
        type: PostType.REPOST,
        originPostId: originPostId,
      },
      select: postSelectRepository,
    });

    return {
      id: post.id,
      publicId: post.publicId,
      content: post.content,
      contentJson: post.contentJson,
      userId: post.userId,
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt.toISOString(),
    };
  }

  async createQuote(
    payload: RepositoryCreatePostPayload,
    originPublicId: string,
    userSnapshot: UserSnapshot,
    originPostId: number,
    tx: Prisma.TransactionClient = prisma,
  ) {
    const post = await tx.post.create({
      data: {
        ...this.baseData(payload, userSnapshot),
        isQuote: true,
        type: PostType.QUOTE,
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
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt.toISOString(),
    };
  }

  async list(): Promise<PostRecord[]> {
    const posts = await prisma.post.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      select: {
        publicId: true,
        content: true,
        userId: true,
        visibility: true,
        isDisinformation: true,
        createdAt: true,
      },
    });

    return posts.map((post) => ({
      publicId: post.publicId,
      content: post.content,
      userId: post.userId,
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt.toISOString(),
    }));
  }
  async findByPublicId(publicId: string, userId?: string | null) {
    return prisma.post.findFirst({
      where: { publicId, isDeleted: false },
      select: {
        id: true,
        ...this.buildFeedSelect(userId),
      },
    });
  }
  async findById(id: number) {
    return prisma.post.findFirst({
      where: { id, isDeleted: false },
      select: {
        publicId: true,
      }
    });
  }
  async findByIds(ids: number[]) {
    if (!ids.length) {
      return [];
    }

    return prisma.post.findMany({
      where: {
        id: { in: ids },
        isDeleted: false,
        isHidden: false,
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
    return prisma.post.findFirst({
      where: { publicId, isDeleted: false },
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

  async findReportTargetByPublicId(publicId: string) {
    return prisma.post.findFirst({
      where: {
        publicId,
        isDeleted: false,
      },
      select: {
        publicId: true,
        userId: true,
        content: true,
        type: true,
      },
    });
  }

  async findDeleteTargetByPublicId(publicId: string) {
    return prisma.post.findFirst({
      where: {
        publicId,
        isDeleted: false,
      },
      select: {
        publicId: true,
        userId: true,
        type: true,
      },
    });
  }

  async createCirclePostMedia(postId: number, mediaUrls: string[]) {
    const mediaData = mediaUrls.map((url) => ({
      key: uuidv4(),
      url,
      postId,
      type: PostMediaType.IMAGE,
      status: PostMediaStatus.UPLOADED,
    }));
    await prisma.postMedia.createMany({
      data: mediaData
    });
  }


  async updateByPublicId(
    publicId: string,
    payload: UpdatePostDto,
  ): Promise<PostRecord> {
    const post = await prisma.post.update({
      where: { publicId },
      data: {
        content: payload.content,
        visibility: payload.visibility,
      },
      select: {
        publicId: true,
        content: true,
        userId: true,
        visibility: true,
        isDisinformation: true,
        createdAt: true,
      },
    });

    return {
      publicId: post.publicId,
      content: post.content,
      userId: post.userId,
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt.toISOString(),
    };
  }


  async updateStatusByPublicId(
    publicId: string,
    status: { isDeleted?: boolean; isHidden?: boolean; isDisinformation?: boolean },
  ): Promise<PostRecord> {
    const post = await prisma.post.update({
      where: { publicId },
      data: {
        isDeleted: status.isDeleted,
        isHidden: status.isHidden,
        isDisinformation: status.isDisinformation,
      },
      select: {
        publicId: true,
        content: true,
        userId: true,
        visibility: true,
        isDisinformation: true,
        createdAt: true,
      },
    });

    return {
      publicId: post.publicId,
      content: post.content,
      userId: post.userId,
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt.toISOString(),
    };
  }


  async softDeleteByPublicId(publicId: string): Promise<void> {
    await prisma.post.update({
      where: { publicId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async updateIsGhost(publicId: string, isGhost: boolean): Promise<void> {
    await prisma.post.update({
      where: { publicId },
      data: { isGhost },
    });
  }

  async updateIsHidden(publicId: string, isHidden: boolean): Promise<void> {
    await prisma.post.update({
      where: { publicId },
      data: { isHidden },
    });
  }
  // TĂNG count + lấy chủ post
  async incrementLikedCount(publicId: string, count: number): Promise<{ likesCount: number; ownerId: string }> {
    return prisma.$transaction(async (tx) => {
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

  // GIẢM count + lấy chủ post (tương tự)
  async decrementLikedCount(publicId: string, count: number): Promise<void> {
    await prisma.$executeRaw`
      UPDATE posts
      SET likes_count = GREATEST(likes_count - ${count}, 0)
      WHERE public_id = ${publicId}
    `
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
    const matches = await prisma.$queryRaw<{ publicId: string }[]>`
      SELECT p.public_id AS publicId
      FROM posts p
      LEFT JOIN posts cursor_post ON cursor_post.public_id = ${cursor}
      WHERE MATCH(p.content) AGAINST (${q} IN BOOLEAN MODE)
        AND p.type = ${PostType.POST}
        AND p.is_deleted = false
        AND p.is_hidden = false
        AND p.visibility = ${VisibilityPost.PUBLIC}
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

    const posts = await prisma.post.findMany({
      where: {
        publicId: {
          in: publicIds,
        },
        type: PostType.POST,
        isDeleted: false,
        isHidden: false,
        visibility: VisibilityPost.PUBLIC,
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
          }
          : {}),
      },
    });

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

  async updateIsDisinformation(publicId: string, isDisinformation: boolean): Promise<void> {
    await prisma.post.update({
      where: { publicId },
      data: { isDisinformation },
    });
  }
}

export const postRepository = new PostRepository();
