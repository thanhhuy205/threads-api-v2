import { BadRequestException } from "@/errors/error";
import { baseLogger } from "@/middlewares/logger";
import { notificationService } from "@/modules/notification-group/service/notification.service";
import type { CreatePostPayload } from "@/modules/post/interfaces/create-post-payload";
import { userService } from "@/modules/user/service/user.service";

class PostMentionService {
  async validateMentions(
    mentions?: CreatePostPayload["mentions"],
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

    const existingIds = await userService.findExistingIds(uniqueMentionIds);

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
        notificationService.handleMention({
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
      baseLogger.error(
        `[mention-notification] Failed to enqueue mention notification for recipient ${recipientId}: ${message}`,
      );
    });
  }
}

export const postMentionService = new PostMentionService();
