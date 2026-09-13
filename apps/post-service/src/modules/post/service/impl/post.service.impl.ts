import { NotFoundException } from '@/errors/error';
// MAINTENANCE: import { BadRequestException } from '@/errors/error';
// MAINTENANCE: import { ABILITY_SERVICE, type AbilityService } from '@workspace-service/modules/ability/ability.service';
// MAINTENANCE: import { GROUP_TEAM_SERVICE, type GroupTeamService } from '@workspace-service/modules/group-team/service/group-team.service';
import { USER_SERVICE, type UserService } from "@auth-service/modules/user/service/user.service";
import { TransactionService } from '@post-service/transaction/transaction.service';
// MAINTENANCE: import { AiService } from '@api/modules/ai/service/ai.service';
// MAINTENANCE: import { PostCreationContext } from '@post-service/modules/post/context/post-creation-context';
// MAINTENANCE: import { POST_CREATION_POLICIES, PostCreationPolicy } from '@post-service/modules/post/policies/interface/post-creation-policy.interface';
// MAINTENANCE: import { PERMISSIONS } from '@libs/common/src/constants/permission.constant';
import { Inject, Injectable, Logger } from "@nestjs/common";
// MAINTENANCE: import { dispatchReplyNotification } from '@notification/events/notification.dispatcher';
// MAINTENANCE: import { PermissionScope, VisibilityPost } from '../../../../../generated/prisma';
import type { CreatePostCommand } from "../../command/create-post.command";
import { PostMapper } from "../../mapper/post.mapper";
import { POST_REPOSITORY, type PostRepository } from "../../repository/post.repository";
// MAINTENANCE: import { POST_MENTION_SERVICE, type PostMentionService } from '../post-mention.service';
// MAINTENANCE: import { POST_META_SERVICE, type PostMetaService } from '../post-meta.service';
import type { PostService } from '../post.service';

@Injectable()
export class PostServiceImpl implements PostService {
  private readonly logger = new Logger(PostServiceImpl.name, { timestamp: true });

  constructor(
    private readonly transactionService: TransactionService,
    @Inject(USER_SERVICE) private readonly userService: UserService,
    @Inject(POST_REPOSITORY) private readonly postRepository: PostRepository,
    // MAINTENANCE: @Inject(POST_MENTION_SERVICE) private readonly postMentionService: PostMentionService,
    // MAINTENANCE: @Inject(POST_META_SERVICE) private readonly postMetaService: PostMetaService,
    // MAINTENANCE: @Inject(ABILITY_SERVICE) private readonly abilityService: AbilityService,
    // MAINTENANCE: @Inject(GROUP_TEAM_SERVICE) private readonly groupTeamService: GroupTeamService,
    // MAINTENANCE: private readonly aiService: AiService,
    // MAINTENANCE: @Inject(POST_CREATION_POLICIES) private readonly postCreationPolicies: PostCreationPolicy[],
  ) { }

  async create(payload: CreatePostCommand) {
    const { snapshot } = await this.resolveAuthorAndMentions(payload);
    const post = await this.transactionService.doInTransaction((tx) =>
      this.postRepository.create(payload, snapshot, tx),
    );
    this.logger.log(`Post created: ${post.publicId}`);
    return post;

    /* MAINTENANCE: policies, AI topics, mentions and notifications.
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
    */
  }

  /* MAINTENANCE: group authorization and creation policies.
  private async resolveCreationContext(
    payload: CreatePostCommand,
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
    payload: CreatePostCommand,
  ): Promise<number | undefined> {
    const ctx = await this.resolveCreationContext(payload);

    await this.abilityService.assertCan(
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
  */


  async reply(publicId: string, payload: CreatePostCommand) {
    const [parent, author] = await Promise.all([
      this.postRepository.findByPublicId(publicId),
      this.resolveAuthorAndMentions(payload),
    ]);
    if (!parent) throw new NotFoundException("Origin post not found");
    const post = await this.transactionService.doInTransaction(async (tx) => {
      return this.postRepository.createReply(
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
    });

    /* MAINTENANCE: topics, mentions and reply notifications.
    await this.finalizeCreation(
      post,
      payload,
      author.snapshot,
      author.mentionIds,
      parent.rootPublicId ?? parent.publicId,
      parent.userId,
      true,
    );
    */
    this.logger.log(`Reply created: ${post.publicId}`);
    return post;
  }

  /* MAINTENANCE: repost and quote creation.
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
  async quote(publicId: string, payload: CreatePostCommand) {
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
  */

  private async resolveAuthorAndMentions(payload: Pick<CreatePostCommand, "userId" | "mentions">) {
    const user = await this.userService.findByUserId(payload.userId);
    if (!user) throw new NotFoundException('User not found');
    return { snapshot: PostMapper.toUserSnapshot(user), mentionIds: [] as string[] };

    /* MAINTENANCE: mention validation.
    const [user, mentionIds] = await Promise.all([
      this.userService.findByUserId(payload.userId),
      this.postMentionService.validateMentions(payload.mentions),
    ]);
    if (!user) throw new NotFoundException("User not found");
    return { snapshot: PostMapper.toUserSnapshot(user), mentionIds };
    */
  }

  /* MAINTENANCE: mention and reply notifications.
  private async finalizeCreation(
    post: { publicId: string },
    payload: CreatePostCommand,
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
  */
}
