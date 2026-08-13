import { NotFoundException } from "@/errors/error";
import { dispatchReplyNotification } from "@/modules/notification-group/events/notification.dispatcher";
import type { CreatePostPayload } from "@/modules/post/interfaces/create-post-payload";
import { Injectable, Logger } from '@nestjs/common';
import { PostBuilder } from "../builder/post.builder";
import { CreatePostDto } from '../dto/request';
import { PostRecord, PostRepository } from "../repository/post.repository";
import { PostMetaService } from "./post-meta.service";

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name, { timestamp: true });

  constructor(
    private readonly postBuilder: PostBuilder,
    private readonly postRepository: PostRepository,
    private readonly postMetaService: PostMetaService,
  ) { }
  async create(payload: CreatePostPayload) {

    this.logger.log(`Creating post for user ${payload.userId} with content: ${payload.content}`);
    const builder = this.postBuilder.fork().user(payload.userId)
      .replyPermission(payload.replyPermission)
      .visibility(payload.visibility)
      .mentions(payload.mentions);

    const { snapshot, options, mentionIds } = await builder.build();

    const post = await builder.createPost(
      () => this.postRepository.create({ ...payload, ...options }, snapshot),
      { topic: payload.topic, mentionIds },
    );

    await this.postMetaService.finalizePostCreation({
      mentionNotification: {
        mentionIds,
        actorId: payload.userId,
        username: snapshot.username,
        avatar: snapshot.avatar,
        targetPostId: post.publicId,
        originPostId: post.publicId,
        postOwnerId: payload.userId,
        content: payload.content,
      },
    });
    return post;
  }

  async reply(publicId: string, payload: CreatePostDto & { userId: string }) {
    const builder = this.postBuilder.fork().user(payload.userId)
      .replyPermission(payload.replyPermission)
      .visibility(payload.visibility)
      .mentions(payload.mentions)
      .existPost(publicId);

    const { snapshot, options, mentionIds, existPost } = await builder.build();
    if (!existPost) {
      throw new NotFoundException("Origin post not found");
    }
    const post = await builder.createPost(
      () =>
        this.postRepository.createReply(
          { ...payload, ...options },
          {
            id: existPost.id,
            publicId: existPost.publicId,
          },
          snapshot,
        ),
      { topic: payload.topic, mentionIds },
    );
    this.logger.log("Created reply post, adding notification group");
    await Promise.all([
      !mentionIds.length
        ? dispatchReplyNotification({
          replyContent: payload.content,
          actorId: payload.userId,
          recipientId: existPost.userId,
          targetPostId: post.publicId,
          lastActorId: payload.userId,
          lastActor: {
            id: payload.userId,
            username: snapshot.username,
            avatar: snapshot.avatar,
          },
          originPostId: existPost.publicId,
          postOwnerId: existPost.userId,
          username: snapshot.username,
          avatar: snapshot.avatar,
        })
        : undefined,
      this.postMetaService.finalizePostCreation({
        mentionNotification: {
          mentionIds,
          actorId: payload.userId,
          username: snapshot.username,
          avatar: snapshot.avatar,
          targetPostId: post.publicId,
          originPostId: existPost.publicId,
          postOwnerId: existPost.userId,
          content: payload.content,
        },
      }),
    ]);
    return {
      publicId: post.publicId,
      content: post.content!,
      userId: post.userId,
      type: post.type,
      visibility: post.visibility,
      createdAt: post.createdAt,
    } as PostRecord;
  }

  async repost(publicId: string, userId: string) {
    const { snapshot, originPost, resolvedOriginPostId, resolvedOriginPublicId } =
      await this.postBuilder.fork().user(userId).originPost(publicId).build();
    if (
      !originPost ||
      resolvedOriginPostId === undefined ||
      resolvedOriginPublicId === undefined
    ) {
      throw new NotFoundException("Origin post not found");
    }

    const post = await this.postRepository.createRepost(
      { userId },
      resolvedOriginPublicId,
      snapshot,
      resolvedOriginPostId,
    );

    await this.postMetaService.finalizePostCreation({
    });
    return {
      publicId: post.publicId,
      content: post.content,
      userId: post.userId,
      type: post.type,
      visibility: post.visibility,
      createdAt: post.createdAt,
    } as PostRecord;
  }

  async quote(publicId: string, payload: CreatePostDto & { userId: string }) {
    const builder = this.postBuilder.fork().user(payload.userId)
      .replyPermission(payload.replyPermission)
      .visibility(payload.visibility)
      .mentions(payload.mentions)
      .originPost(publicId);

    const {
      snapshot,
      options,
      mentionIds,
      originPost,
      resolvedOriginPostId,
      resolvedOriginPublicId,
    } = await builder.build();
    if (
      !originPost ||
      resolvedOriginPostId === undefined ||
      resolvedOriginPublicId === undefined
    ) {
      throw new NotFoundException("Origin post not found");
    }

    const post = await builder.createPost(
      () =>
        this.postRepository.createQuote(
          { ...payload, ...options },
          resolvedOriginPublicId,
          snapshot,
          resolvedOriginPostId,
        ),
      { topic: payload.topic, mentionIds },
    );

    await this.postMetaService.finalizePostCreation({
      mentionNotification: {
        mentionIds,
        actorId: payload.userId,
        username: snapshot.username,
        avatar: snapshot.avatar,
        targetPostId: post.publicId,
        originPostId: resolvedOriginPublicId,
        postOwnerId: originPost.userId,
        content: payload.content,
      },
    });
    return {
      publicId: post.publicId,
      content: post.content,
      userId: payload.userId,
      type: post.type,
      visibility: post.visibility,
      createdAt: new Date().toISOString(),
    } as PostRecord;
  }

  increaseLikeCount(publicId: string, count: number) {
    return this.postRepository.increaseLikeCount(publicId, count);
  }

  decreaseLikeCount(publicId: string, count: number) {
    return this.postRepository.decreaseLikeCount(publicId, count);
  }

}
