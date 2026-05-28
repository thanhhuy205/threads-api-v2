import prisma from "@/config/prisma";
import { baseLogger } from "@/middlewares/logger";
import type {
  CreateCirclePostPayload,
  CreatePostPayload,
} from "@/modules/post/interfaces/create-post-payload";
import {
  postFeedSelect,
  postSelectRepository,
} from "@/modules/post/selector/post.selector";
import {
  PostType,
  Prisma,
  ReplyPermission,
  VisibilityPost,
} from "@prisma/client";
import { UpdatePostDto } from "../dto/post.dto";
import { UserSnapshot } from "../mapper/post.mapper";

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

type RepositoryCreatePostPayload = (CreatePostPayload | CreateCirclePostPayload) & {
  contentJson?: unknown;
  type?: PostType;
  replyPermission?: ReplyPermission;
  visibility?: VisibilityPost;
};

type CreateRepostPayload = {
  userId: string;
  content?: string;
  replyPermission?: ReplyPermission;
  visibility?: VisibilityPost;
};

class PostRepository implements ICursorPagination<Prisma.PostWhereInput, any> {
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
        ...postFeedSelect,
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

  private baseData(
    payload: RepositoryCreatePostPayload,
    userSnapshot: UserSnapshot,
  ) {
    return {
      content: payload.content,
      contentJson: this.resolveContentJson(payload.contentJson),
      userId: payload.userId,
      type: payload.type ?? PostType.POST,
      replyPermission: payload.replyPermission ?? ReplyPermission.EVERYONE,
      visibility: payload.visibility ?? VisibilityPost.PUBLIC,
      userSnapshot,
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
  async findByPublicId(publicId: string) {
    return prisma.post.findFirst({
      where: { publicId, isDeleted: false },
      select: {
        id: true,
        ...postFeedSelect,
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

  // Tăng count ở bảng post
  async incrementLikedCount(publicId: string, count: number): Promise<void> {
    await prisma.$executeRaw`
    UPDATE posts
    SET likes_count = GREATEST(likes_count + ${count}, 0)
    WHERE public_id = ${publicId}
  `;
  }
  // Tăng count ở bảng post
  async decrementLikedCount(publicId: string, count: number): Promise<void> {
    await prisma.$executeRaw`
    UPDATE posts
    SET likes_count = GREATEST(likes_count - ${count}, 0)
    WHERE public_id = ${publicId}
  `;
  }

  async updateIsDisinformation(publicId: string, isDisinformation: boolean): Promise<void> {
    await prisma.post.update({
      where: { publicId },
      data: { isDisinformation },
    });
  }
}

export const postRepository = new PostRepository();
