import { ActionType, Prisma } from "@prisma/client";
import { userActionLogRepository } from "../repository/user-action-log.repository";

type LogActionInput = {
  userId: string;
  targetId: string;
  metadata?: Prisma.InputJsonValue;
  tx?: Prisma.TransactionClient;
};

type LogTypedActionInput = LogActionInput & {
  type: ActionType;
};

class UserActionLogService {
  logAction(input: LogTypedActionInput) {
    return userActionLogRepository.create(
      {
        userId: input.userId,
        type: input.type,
        targetId: input.targetId,
        metadata: input.metadata,
      },
      input.tx,
    );
  }

  findActionInPost(params: {
    userId: string | string[];
    postPublicId: string;
    actionType: ActionType;
  }) {
    return userActionLogRepository.findActionInPost(params);
  }

  countActionLog(userId: string, type: ActionType) {
    return userActionLogRepository.countByType(
      {
        userId,
        type,
      },
    );
  }

  logPostCreated(input: LogActionInput) {
    return this.logAction({ ...input, type: ActionType.POST_CREATED });
  }

  logPostDeleted(input: LogActionInput) {
    return this.logAction({ ...input, type: ActionType.POST_DELETED });
  }

  logLikeCreated(input: LogActionInput) {
    return this.logAction({ ...input, type: ActionType.LIKE_CREATED });
  }

  logFollowerCreated(input: LogActionInput) {
    return this.logAction({ ...input, type: ActionType.FLOW_FOLLOWER_CREATED });
  }

  logFollowingCreated(input: LogActionInput) {
    return this.logAction({ ...input, type: ActionType.FOLLOW_FOLLOWING_CREATED });
  }

  logQuoteCreated(input: LogActionInput) {
    return this.logAction({ ...input, type: ActionType.QUOTE_CREATED });
  }

  logQuoteDeleted(input: LogActionInput) {
    return this.logAction({ ...input, type: ActionType.QUOTE_DELETED });
  }

  logShareCreated(input: LogActionInput) {
    return this.logAction({ ...input, type: ActionType.SHARE_CREATED });
  }

  logShareDeleted(input: LogActionInput) {
    return this.logAction({ ...input, type: ActionType.SHARE_DELETED });
  }

  logInviteSent(input: LogActionInput) {
    return this.logAction({ ...input, type: ActionType.INVITE_SENT });
  }

  logInviteAccepted(input: LogActionInput) {
    return this.logAction({ ...input, type: ActionType.INVITE_ACCEPTED });
  }

  logJoinCircle(input: LogActionInput) {
    return this.logAction({ ...input, type: ActionType.JOIN_CIRCLE });
  }

  logLeaveCircle(input: LogActionInput) {
    return this.logAction({ ...input, type: ActionType.LEAVE_CIRCLE });
  }
}

export const userActionLogService = new UserActionLogService();
