import { NotFoundException } from "@/errors/error";
import { baseLogger } from "@/middlewares/logger";
import { notificationService } from "@/modules/notification-group/service/notification.service";
import type { CreatePostPayload } from "@/modules/post/interfaces/create-post-payload";
import { PostBuilder } from "../builder/post.builder";
import { CreatePostDto } from "../dto/post.dto";
import { PostRecord, postRepository } from "../repository/post.repository";
import { postMetaService } from "./post-meta.service";

class PostService {
  async create(payload: CreatePostPayload) {
    const builder = PostBuilder.user(payload.userId)
      .replyPermission(payload.replyPermission)
      .visibility(payload.visibility)
      .mentions(payload.mentions);

    const { snapshot, options, mentionIds } = await builder.build();

    const post = await builder.createPost(
      () => postRepository.create({ ...payload, ...options }, snapshot),
      { topic: payload.topic, mentionIds },
    );

    await postMetaService.finalizePostCreation({
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
    const builder = PostBuilder.user(payload.userId)
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
        postRepository.createReply(
          { ...payload, ...options },
          {
            id: existPost.id,
            publicId: existPost.publicId,
          },
          snapshot,
        ),
      { topic: payload.topic, mentionIds },
    );
    baseLogger.info("Created reply post, adding notification group");
    await Promise.all([
      !mentionIds.length
        ? notificationService.handleNewComment({
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
      postMetaService.finalizePostCreation({
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
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt,
    } as PostRecord;
  }

  async repost(publicId: string, userId: string) {
    const { snapshot, originPost, resolvedOriginPostId, resolvedOriginPublicId } =
      await PostBuilder.user(userId).originPost(publicId).build();
    if (
      !originPost ||
      resolvedOriginPostId === undefined ||
      resolvedOriginPublicId === undefined
    ) {
      throw new NotFoundException("Origin post not found");
    }

    const post = await postRepository.createRepost(
      { userId },
      resolvedOriginPublicId,
      snapshot,
      resolvedOriginPostId,
    );

    await postMetaService.finalizePostCreation({
    });
    return {
      publicId: post.publicId,
      content: post.content,
      userId: post.userId,
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt,
    } as PostRecord;
  }

  async quote(publicId: string, payload: CreatePostDto & { userId: string }) {
    const builder = PostBuilder.user(payload.userId)
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
        postRepository.createQuote(
          { ...payload, ...options },
          resolvedOriginPublicId,
          snapshot,
          resolvedOriginPostId,
        ),
      { topic: payload.topic, mentionIds },
    );

    await postMetaService.finalizePostCreation({
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
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: new Date().toISOString(),
    } as PostRecord;
  }

  increaseLikeCount(publicId: string, count: number) {
    return postRepository.increaseLikeCount(publicId, count);
  }

  decreaseLikeCount(publicId: string, count: number) {
    return postRepository.decreaseLikeCount(publicId, count);
  }

}

export const postService = new PostService();
