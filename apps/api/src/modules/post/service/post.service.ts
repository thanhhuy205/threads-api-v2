import { PERMISSIONS } from '@/common/constants/permission.constant';
import { BadRequestException, NotFoundException } from "@/errors/error";
import { AccessControlService } from '@/modules/access-control/services/access-control.service';
import { GroupTeamService } from '@/modules/group-team/service/group-team.service';
import { dispatchReplyNotification } from "@/modules/notification-group/events/notification.dispatcher";
import type { CreatePostPayload } from "@/modules/post/interfaces/create-post-payload";
import { UserService } from "@/modules/user/service/user.service";
import { TransactionService } from "@/shared/transaction/transaction.service";
import { AiService } from '@api/modules/ai/service/ai.service';
import { PostCreationContext } from '@api/modules/post/context/post-creation-context';
import { POST_CREATION_POLICIES, PostCreationPolicy } from '@api/modules/post/policies/interface/post-creation-policy.interface';
import { Inject, Injectable, Logger } from "@nestjs/common";
import { PermissionScope, VisibilityPost } from '@prisma/client';
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
    private readonly aiService: AiService,
    @Inject(POST_CREATION_POLICIES)
    private readonly postCreationPolicies: PostCreationPolicy[],
  ) { }

  async create(payload: CreatePostPayload) {
    const groupTeamId = await this.authorizeCreation(payload);
    const createPayload = { ...payload, groupTeamId };

    const { snapshot, mentionIds } = await this.resolveAuthorAndMentions(payload);
    const recommendTopics = await this.aiService.classifyTopics(payload.content);
    this.logger.log(`Recommended topics for post: ${recommendTopics.join(", ")}`);
    const topics = [...(payload.topic ? [payload.topic] : []), ...recommendTopics];
    this.logger.log(`Final topics for post: ${topics.join(", ")}`);

    const post = await this.transactionService.doInTransaction(async (tx) => {
      const created = await this.postRepository.create(createPayload, snapshot, tx);
      await this.postMetaService.attachPostMeta(tx, created.id!, {
        topics,
        mentionIds,
      });
      return created;
    });

    await this.finalizeCreation(post, payload, snapshot, mentionIds, post.publicId, payload.userId);
    return post;
  }

  private async resolveCreationContext(
    payload: CreatePostPayload,
  ): Promise<PostCreationContext> {
    const visibility = payload.visibility ?? VisibilityPost.WORKSPACE;

    const scope =
      visibility === VisibilityPost.GROUP
        ? PermissionScope.GROUP
        : PermissionScope.WORKSPACE;

    if (visibility !== VisibilityPost.GROUP) {
      return { scope };
    }

    if (!payload.groupPublicId) {
      throw new BadRequestException(
        'groupPublicId is required for group posts',
      );
    }

    const group = await this.groupTeamService.resolveGroupForPost(
      payload.groupPublicId,
      payload.userId,
    );

    return { scope, groupTeamId: group.id };
  }

  private async authorizeCreation(
    payload: CreatePostPayload,
  ): Promise<number | undefined> {
    const ctx = await this.resolveCreationContext(payload);

    await this.accessControlService.assertPermission(
      payload.userId,
      PERMISSIONS.POST_CREATE,
      ctx.scope,
    );

    for (const policy of this.postCreationPolicies) {
      if (policy.applies(payload)) {
        await policy.enforce(payload, ctx);
      }
    }

    return ctx.groupTeamId;
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
        topics: [...(payload.topic ? [payload.topic] : [])],
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
        topics: [...(payload.topic ? [payload.topic] : [])],
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
