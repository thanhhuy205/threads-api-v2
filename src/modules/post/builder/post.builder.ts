import prisma from "@/config/prisma";
import {
  BadRequestException,
  NotFoundException,
} from "@/errors/error";
import type { CreatePostPayload } from "@/modules/post/interfaces/create-post-payload";
import { PostMapper } from "@/modules/post/mapper/post.mapper";
import { userService } from "@/modules/user/service/user.service";
import { Prisma, ReplyPermission, VisibilityPost } from "@prisma/client";
import { PostRecord, postRepository } from "../repository/post.repository";
import { postMentionService } from "../service/post-mention.service";
import { postMetaService, type CreatePostMeta } from "../service/post-meta.service";

type UserSnapshot = ReturnType<typeof PostMapper.toUserSnapshot>;

type ExistPost = NonNullable<
  Awaited<ReturnType<typeof postRepository.findByPublicId>>
>;

type ResolvedOriginPost = NonNullable<
  Awaited<ReturnType<typeof postRepository.findOriginReferenceByPublicId>>
>;

export type PostBuildResult = {
  snapshot: UserSnapshot;
  options: {
    replyPermission: ReplyPermission;
    visibility: VisibilityPost;
  };
  mentionIds: string[];
  existPost?: ExistPost;
  originPost?: ResolvedOriginPost;
  resolvedOriginPostId?: number;
  resolvedOriginPublicId?: string;
};

class PostBuilder {
  private pending: Promise<void> = Promise.resolve();
  private snapshot?: UserSnapshot;
  private options: PostBuildResult["options"] = {
    replyPermission: ReplyPermission.EVERYONE,
    visibility: VisibilityPost.PUBLIC,
  };
  private mentionIds: string[] = [];
  private existPostRef?: ExistPost;
  private originPostRef?: ResolvedOriginPost;

  static user(userId: string): PostBuilder {
    return new PostBuilder().user(userId);
  }

  user(userId: string): this {
    this.pending = this.pending.then(async () => {
      const userSnapshot = await userService.findByUserId(userId);
      if (!userSnapshot) throw new NotFoundException("User not found");
      this.snapshot = PostMapper.toUserSnapshot(userSnapshot);
    });
    return this;
  }

  replyPermission(replyPermission?: ReplyPermission): this {
    this.options.replyPermission = replyPermission ?? ReplyPermission.EVERYONE;
    return this;
  }

  visibility(visibility?: VisibilityPost): this {
    this.options.visibility = visibility ?? VisibilityPost.PUBLIC;
    return this;
  }

  mentions(mentions?: CreatePostPayload["mentions"]): this {
    this.pending = this.pending.then(async () => {
      this.mentionIds = await postMentionService.validateMentions(mentions);
    });
    return this;
  }

  existPost(publicId: string): this {
    this.pending = this.pending.then(async () => {
      const existPost = await postRepository.findByPublicId(publicId);
      if (!existPost) throw new NotFoundException("Origin post not found");
      this.existPostRef = existPost;
    });
    return this;
  }

  originPost(publicId: string): this {
    this.pending = this.pending.then(async () => {
      const originPost = await postRepository.findOriginReferenceByPublicId(publicId);
      if (!originPost) throw new NotFoundException("Origin post not found");
      this.originPostRef = originPost;
    });
    return this;
  }

  async build(): Promise<PostBuildResult> {
    await Promise.all([this.pending]);

    const result: PostBuildResult = {
      snapshot: this.snapshot!,
      options: this.options,
      mentionIds: this.mentionIds,
      existPost: this.existPostRef,
      originPost: this.originPostRef,
    };

    if (this.originPostRef) {
      result.resolvedOriginPostId =
        this.originPostRef.rootPostId ?? this.originPostRef.originPostId ?? this.originPostRef.id;
      result.resolvedOriginPublicId =
        this.originPostRef.rootPublicId ?? this.originPostRef.originPublicId ?? this.originPostRef.publicId;
    }

    return result;
  }

  async createPost(
    createFn: (tx: Prisma.TransactionClient) => Promise<PostRecord>,
    meta?: CreatePostMeta,
  ): Promise<PostRecord> {
    const post = await createFn(prisma);

    if (!post.id) throw new BadRequestException("Failed to create post");

    await postMetaService.attachPostMeta(prisma, post.id, meta);
    return post;
  }
}

export { PostBuilder };
