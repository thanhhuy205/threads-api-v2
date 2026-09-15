import { BadRequestException } from '@purse/common/errors';
import { dispatchMentionNotification } from "@notification/events/notification.dispatcher";
import type { CreatePostCommand } from "../../command/create-post.command";
import { USER_SERVICE, type UserService } from '@auth-service/modules/user/service/user.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { PostMentionService } from '../post-mention.service';

@Injectable()
export class PostMentionServiceImpl implements PostMentionService {
  private readonly logger = new Logger(PostMentionServiceImpl.name, { timestamp: true });

  constructor(@Inject(USER_SERVICE) private readonly userService: UserService) { }
  async validateMentions(
    mentions?: CreatePostCommand["mentions"],
  ): Promise<string[]> {
    if (!mentions?.length) {
      return [];
    }

    if (mentions.length > 5) {
      throw new BadRequestException("Mentions must be at most 5 users");
    }

    const mentionIds = mentions.map((mention) => mention.userId);
    const uniqueMentionIds = [...new Set(mentionIds)];

    if (uniqueMentionIds.length !== mentionIds.length) {
      throw new BadRequestException(
        "Mentions must not contain duplicate users",
      );
    }

    const existingIds = await this.userService.findExistingIds(uniqueMentionIds);

    if (existingIds.length !== uniqueMentionIds.length) {
      throw new BadRequestException("One or more mentioned users do not exist");
    }

    return uniqueMentionIds;
  }

  async dispatchMentionNotifications({
    mentionIds,
    actorId,
    username,
    avatar,
    targetPostId,
    originPostId,
    postOwnerId,
    content,
  }: {
    mentionIds: string[];
    actorId: string;
    username: string;
    avatar?: string;
    targetPostId: string;
    originPostId: string;
    postOwnerId: string;
    content: string;
  }): Promise<void> {
    if (!mentionIds.length) return;

    const recipientIds = mentionIds.filter((recipientId) => recipientId !== actorId);
    if (!recipientIds.length) return;

    const results = await Promise.allSettled(
      recipientIds.map((recipientId) =>
        dispatchMentionNotification({
          mentionContent: content,
          actorId,
          recipientId,
          targetPostId,
          originPostId,
          username,
          avatar,
          postOwnerId,
        }),
      ),
    );

    results.forEach((result, index) => {
      if (result.status === "fulfilled") return;
      const recipientId = recipientIds[index];
      const message =
        result.reason instanceof Error ? result.reason.message : String(result.reason);
      this.logger.error(
        `[mention-notification] Failed to enqueue mention notification for recipient ${recipientId}: ${message}`,
      );
    });
  }
}
