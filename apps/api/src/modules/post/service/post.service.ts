import { PERMISSIONS } from '@/common/constants/permission.constant';
import { BadRequestException, NotFoundException } from "@/errors/error";
import { AccessControlService } from '@/modules/access-control/services/access-control.service';
import { GroupTeamService } from '@/modules/group-team/service/group-team.service';
import { dispatchReplyNotification } from "@/modules/notification-group/events/notification.dispatcher";
import type { CreatePostPayload } from "@/modules/post/interfaces/create-post-payload";
import { UserService } from "@/modules/user/service/user.service";
import { TransactionService } from "@/shared/transaction/transaction.service";
import { Injectable, Logger } from "@nestjs/common";
import { PermissionScope, PostType, VisibilityPost } from '@prisma/client';
import { PostMapper } from "../mapper/post.mapper";
import { PostRepository } from "../repository/post.repository";
import { PostMentionService } from "./post-mention.service";
import { PostMetaService } from "./post-meta.service";

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name, { timestamp: true });

  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
    private readonly postRepository: PostRepository,
    private readonly postMentionService: PostMentionService,
    private readonly postMetaService: PostMetaService,
    private readonly accessControlService: AccessControlService,
    private readonly groupTeamService: GroupTeamService,
  ) {}

  async create(payload: CreatePostPayload) {
    const groupTeamId = await this.authorizeCreation(payload);
    const createPayload = { ...payload, groupTeamId };
    const { snapshot, mentionIds } = await this.resolveAuthorAndMentions(payload);
    const post = await this.transactionService.doInTransaction(async (tx) => {
      const created = await this.postRepository.create(createPayload, snapshot, tx);
      await this.postMetaService.attachPostMeta(tx, created.id!, {
        topic: payload.topic,
        mentionIds,
      });
      return created;
    });
    await this.finalizeCreation(post, payload, snapshot, mentionIds, post.publicId, payload.userId);
    return post;
  }

  private async authorizeCreation(
    payload: CreatePostPayload,
  ): Promise<number | undefined> {
    const visibility = payload.visibility ?? VisibilityPost.WORKSPACE;
    const scope =
      visibility === VisibilityPost.GROUP
        ? PermissionScope.GROUP
        : PermissionScope.WORKSPACE;

    let groupTeamId: number | undefined;
    if (visibility === VisibilityPost.GROUP) {
      if (!payload.groupPublicId) {
        throw new BadRequestException(
          'groupPublicId is required for group posts',
        );
      }
      groupTeamId = (
        await this.groupTeamService.resolveGroupForPost(
          payload.groupPublicId,
          payload.userId,
        )
      ).id;
    } else if (payload.groupPublicId) {
      throw new BadRequestException(
        'groupPublicId is only allowed for group posts',
      );
    }

    await this.accessControlService.assertPermission(
      payload.userId,
      PERMISSIONS.POST_CREATE,
      scope,
    );

    if (payload.type === PostType.ANNOUNCEMENT) {
      if (visibility !== VisibilityPost.WORKSPACE) {
        throw new BadRequestException(
          'Announcements can only be published to the workspace',
        );
      }
      await this.accessControlService.assertPermission(
        payload.userId,
        PERMISSIONS.ANNOUNCEMENT_CREATE,
      );
    }

    if (payload.isPinned) {
      await this.accessControlService.assertPermission(
        payload.userId,
        PERMISSIONS.POST_PIN,
        scope,
      );
    }

    if (payload.expiresAt !== undefined && payload.expiresAt !== null) {
      if (payload.expiresAt.getTime() <= Date.now()) {
        throw new BadRequestException('expiresAt must be in the future');
      }
      await this.accessControlService.assertPermission(
        payload.userId,
        PERMISSIONS.POST_EXPIRE,
        scope,
      );
    }

    return groupTeamId;
  }

  async reply(publicId: string, payload: CreatePostPayload) {
    const [parent, author] = await Promise.all([
      this.postRepository.findByPublicId(publicId),
      this.resolveAuthorAndMentions(payload),
    ]);
    if (!parent) throw new NotFoundException("Origin post not found");

    const post = await this.transactionService.doInTransaction(async (tx) => {
      const created = await this.postRepository.createReply(
        payload,
        {
          parentPostId: parent.id,
          parentPublicId: parent.publicId,
          rootPostId: parent.rootPostId ?? parent.id,
          rootPublicId: parent.rootPublicId ?? parent.publicId,
          userSnapshot: author.snapshot,
        },
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

    const post = await this.transactionService.doInTransaction((tx) =>
      this.postRepository.createRepost(
        { userId },
        {
          originPublicId: origin.originPublicId ?? origin.publicId,
          originPostId: origin.originPostId ?? origin.id,
          userSnapshot: author.snapshot,
        },
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

    const post = await this.transactionService.doInTransaction(async (tx) => {
      const created = await this.postRepository.createQuote(
        payload,
        {
          originPublicId: origin.originPublicId ?? origin.publicId,
          originPostId: origin.originPostId ?? origin.id,
          userSnapshot: author.snapshot,
        },
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
