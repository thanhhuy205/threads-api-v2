-- Add action tracking support for daily quests and user activity logs.

ALTER TABLE `daily_quests`
    ADD COLUMN `action_enum` ENUM(
        'POST_CREATED',
        'POST_DELETED',
        'LIKE_CREATED',
        'FLOW_FOLLOWER_CREATED',
        'FOLLOW_FOLLOWING_CREATED',
        'QUOTE_CREATED',
        'QUOTE_DELETED',
        'SHARE_CREATED',
        'SHARE_DELETED',
        'INVITE_SENT',
        'INVITE_ACCEPTED',
        'JOIN_CIRCLE',
        'LEAVE_CIRCLE'
    ) NOT NULL DEFAULT 'POST_CREATED';

ALTER TABLE `daily_quests`
    ALTER `action_enum` DROP DEFAULT;

ALTER TABLE `anti_spam`
    MODIFY `action` ENUM(
        'POST_CREATED',
        'POST_DELETED',
        'LIKE_CREATED',
        'FLOW_FOLLOWER_CREATED',
        'FOLLOW_FOLLOWING_CREATED',
        'QUOTE_CREATED',
        'QUOTE_DELETED',
        'SHARE_CREATED',
        'SHARE_DELETED',
        'INVITE_SENT',
        'INVITE_ACCEPTED',
        'JOIN_CIRCLE',
        'LEAVE_CIRCLE'
    ) NOT NULL;

CREATE TABLE `user_action_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `type_enum` ENUM(
        'POST_CREATED',
        'POST_DELETED',
        'LIKE_CREATED',
        'FLOW_FOLLOWER_CREATED',
        'FOLLOW_FOLLOWING_CREATED',
        'QUOTE_CREATED',
        'QUOTE_DELETED',
        'SHARE_CREATED',
        'SHARE_DELETED',
        'INVITE_SENT',
        'INVITE_ACCEPTED',
        'JOIN_CIRCLE',
        'LEAVE_CIRCLE'
    ) NOT NULL,
    `targetId` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_user_action_logs_user_id`(`user_id`),
    INDEX `idx_user_action_logs_type`(`type_enum`),
    INDEX `idx_user_action_logs_created_at`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `user_action_logs`
    ADD CONSTRAINT `user_action_logs_user_id_fkey`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
