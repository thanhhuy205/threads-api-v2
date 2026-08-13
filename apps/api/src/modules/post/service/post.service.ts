import { NotFoundException } from "@/errors/error";
import { dispatchReplyNotification } from "@/modules/notification-group/events/notification.dispatcher";
import type { CreatePostPayload } from "@/modules/post/interfaces/create-post-payload";
import { UserService } from "@/modules/user/service/user.service";
import { PrismaService } from "@/shared/database/prisma.service";
import { Injectable, Logger } from "@nestjs/common";
import { PostMapper } from "../mapper/post.mapper";
import { PostRepository } from "../repository/post.repository";
import { PostMentionService } from "./post-mention.service";
import { PostMetaService } from "./post-meta.service";

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name, { timestamp: true });

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly postRepository: PostRepository,
    private readonly postMentionService: PostMentionService,
    private readonly postMetaService: PostMetaService,
  ) {}

  async create(payload: CreatePostPayload) {
    const { snapshot, mentionIds } = await this.resolveAuthorAndMentions(payload);
    const post = await this.prisma.$transaction(async (tx) => {
      const created = await this.postRepository.create(payload, snapshot, tx);
      await this.postMetaService.attachPostMeta(tx, created.id!, {
        topic: payload.topic,
        mentionIds,
      });
      return created;
    });
    await this.finalizeCreation(post, payload, snapshot, mentionIds, post.publicId, payload.userId);
    return post;
  }

  async reply(publicId: string, payload: CreatePostPayload) {
    const [parent, author] = await Promise.all([
      this.postRepository.findByPublicId(publicId),
      this.resolveAuthorAndMentions(payload),
    ]);
    if (!parent) throw new NotFoundException("Origin post not found");

    const post = await this.prisma.$transaction(async (tx) => {
      const created = await this.postRepository.createReply(
        payload,
        {
          id: parent.id,
          publicId: parent.publicId,
          rootId: parent.rootPostId ?? parent.id,
          rootPublicId: parent.rootPublicId ?? parent.publicId,
        },
        author.snapshot,
        tx,
      );
      await this.postMetaService.attachPostMeta(tx, created.id!, {
        topic: payload.topic,
        mentionIds: author.mentionIds,
      });
      return created;
    });

    await this.finalizeCreation(
      post,
      payload,
      author.snapshot,
      author.mentionIds,
      parent.rootPublicId ?? parent.publicId,
      parent.userId,
      true,
    );
    return post;
  }

  async repost(publicId: string, userId: string) {
    const [origin, author] = await Promise.all([
      this.postRepository.findOriginReferenceByPublicId(publicId),
      this.resolveAuthorAndMentions({ userId }),
    ]);
    if (!origin) throw new NotFoundException("Origin post not found");

    const post = await this.prisma.$transaction((tx) =>
      this.postRepository.createRepost(
        { userId },
        origin.originPublicId ?? origin.publicId,
        author.snapshot,
        origin.originPostId ?? origin.id,
        tx,
      ),
    );
    await this.postMetaService.finalizePostCreation({});
    return post;
  }

  async quote(publicId: string, payload: CreatePostPayload) {
    const [origin, author] = await Promise.all([
      this.postRepository.findOriginReferenceByPublicId(publicId),
      this.resolveAuthorAndMentions(payload),
    ]);
    if (!origin) throw new NotFoundException("Origin post not found");

    const post = await this.prisma.$transaction(async (tx) => {
      const created = await this.postRepository.createQuote(
        payload,
        origin.originPublicId ?? origin.publicId,
        author.snapshot,
        origin.originPostId ?? origin.id,
        tx,
      );
      await this.postMetaService.attachPostMeta(tx, created.id!, {
        topic: payload.topic,
        mentionIds: author.mentionIds,
      });
      return created;
    });
    await this.finalizeCreation(
      post,
      payload,
      author.snapshot,
      author.mentionIds,
      origin.originPublicId ?? origin.publicId,
      origin.userId,
    );
    return post;
  }

  private async resolveAuthorAndMentions(payload: Pick<CreatePostPayload, "userId" | "mentions">) {
    const [user, mentionIds] = await Promise.all([
      this.userService.findByUserId(payload.userId),
      this.postMentionService.validateMentions(payload.mentions),
    ]);
    if (!user) throw new NotFoundException("User not found");
    return { snapshot: PostMapper.toUserSnapshot(user), mentionIds };
  }

  private async finalizeCreation(
    post: { publicId: string },
    payload: CreatePostPayload,
    snapshot: ReturnType<typeof PostMapper.toUserSnapshot>,
    mentionIds: string[],
    originPostId: string,
    postOwnerId: string,
    isReply = false,
  ) {
    await this.postMetaService.finalizePostCreation({
      mentionNotification: {
        mentionIds,
        actorId: payload.userId,
        username: snapshot.username,
        avatar: snapshot.avatar,
        targetPostId: post.publicId,
        originPostId,
        postOwnerId,
        content: payload.content,
      },
    });
    if (isReply && !mentionIds.length && payload.userId !== postOwnerId) {
      await dispatchReplyNotification({
        replyContent: payload.content,
        actorId: payload.userId,
        recipientId: postOwnerId,
        targetPostId: post.publicId,
        lastActorId: payload.userId,
        lastActor: { id: payload.userId, username: snapshot.username, avatar: snapshot.avatar },
        originPostId,
        postOwnerId,
        username: snapshot.username,
        avatar: snapshot.avatar,
      });
    }
    this.logger.log(`${isReply ? "Reply" : "Post"} created: ${post.publicId}`);
  }
}
