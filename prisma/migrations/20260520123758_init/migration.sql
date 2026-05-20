-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    INDEX `idx_roles_name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_roles` (
    `id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_user_roles_user_id`(`user_id`),
    INDEX `idx_user_roles_role_id`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `permissions_name_key`(`name`),
    UNIQUE INDEX `permissions_code_key`(`code`),
    INDEX `idx_permissions_code`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permissions` (
    `id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `permission_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_role_permissions_role_id`(`role_id`),
    INDEX `idx_role_permissions_permission_id`(`permission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NULL,
    `bio` TEXT NULL,
    `avatar` VARCHAR(255) NULL,
    `verified_at` DATETIME(3) NULL,
    `status` ENUM('ACTIVE', 'SUSPENDED', 'BANNED', 'DEACTIVATED') NOT NULL DEFAULT 'ACTIVE',
    `banned_until` DATETIME(3) NULL,
    `followers_count` INTEGER NOT NULL DEFAULT 0,
    `following_count` INTEGER NOT NULL DEFAULT 0,
    `posts_count` INTEGER NOT NULL DEFAULT 0,
    `is_private` BOOLEAN NOT NULL DEFAULT false,
    `location` VARCHAR(255) NULL,
    `website` VARCHAR(255) NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    INDEX `idx_users_deleted_at`(`deleted_at`),
    INDEX `idx_users_banned_until`(`banned_until`),
    INDEX `idx_users_status_banned_until`(`status`, `banned_until`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` VARCHAR(191) NOT NULL,
    `reporter_id` VARCHAR(191) NOT NULL,
    `target_type` ENUM('POST', 'USER') NOT NULL,
    `target_id` VARCHAR(255) NOT NULL,
    `reason` TEXT NOT NULL,
    `status` ENUM('PENDING', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'PENDING',
    `admin_note` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_reports_reporter_id`(`reporter_id`),
    INDEX `idx_reports_target`(`target_type`, `target_id`),
    INDEX `idx_reports_status_created_at`(`status`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_codes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `type` ENUM('FORGOT_PASSWORD', 'RESET_PASSWORD', 'VERIFY_ACCOUNT') NOT NULL,
    `tokenHash` VARCHAR(100) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `used_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `verification_codes_tokenHash_key`(`tokenHash`),
    INDEX `idx_verification_codes_user_type_created`(`user_id`, `type`, `created_at`),
    INDEX `idx_verification_codes_expires_at`(`expires_at`),
    INDEX `idx_verification_codes_used_at`(`used_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message_groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL DEFAULT '',
    `groupType` ENUM('PRIVATE', 'CROWD') NOT NULL DEFAULT 'PRIVATE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by_id` VARCHAR(191) NOT NULL,
    `last_message_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `message_groups_public_id_key`(`public_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_message_groups` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `messageGroupId` INTEGER NULL,

    INDEX `idx_messages_sender_id`(`user_id`),
    UNIQUE INDEX `uq_member_message_groups_group_user`(`messageGroupId`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `message_group_id` INTEGER NOT NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `messages_public_id_key`(`public_id`),
    INDEX `idx_messages_sender_id`(`sender_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `type` ENUM('POST', 'REPLY', 'REPOST', 'QUOTE', 'CIRCLE') NOT NULL DEFAULT 'POST',
    `visibility` ENUM('PUBLIC', 'FRIEND', 'PRIVATE', 'CIRCLE') NOT NULL DEFAULT 'PUBLIC',
    `parent_id` INTEGER NULL,
    `origin_post_id` INTEGER NULL,
    `root_post_id` INTEGER NULL,
    `parent_public_id` VARCHAR(191) NULL,
    `origin_public_id` VARCHAR(191) NULL,
    `root_public_id` VARCHAR(191) NULL,
    `user_snapshot` JSON NULL,
    `reply_permission` ENUM('EVERYONE', 'FOLLOWERS', 'FOLLOWING', 'MENTIONED') NOT NULL DEFAULT 'EVERYONE',
    `likes_count` INTEGER NOT NULL DEFAULT 0,
    `replies_count` INTEGER NOT NULL DEFAULT 0,
    `reposts_and_quotes_count` INTEGER NOT NULL DEFAULT 0,
    `views_count` INTEGER NOT NULL DEFAULT 0,
    `is_quote` BOOLEAN NOT NULL DEFAULT false,
    `is_pinned` BOOLEAN NOT NULL DEFAULT false,
    `is_ghost` BOOLEAN NOT NULL DEFAULT false,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `posts_public_id_key`(`public_id`),
    INDEX `posts_user_id_created_at_idx`(`user_id`, `created_at`),
    INDEX `posts_parent_id_idx`(`parent_id`),
    INDEX `posts_origin_post_id_idx`(`origin_post_id`),
    INDEX `posts_root_post_id_idx`(`root_post_id`),
    INDEX `posts_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NULL,
    `url` VARCHAR(2048) NOT NULL,
    `type_enum` ENUM('IMAGE', 'VIDEO', 'GIF', 'OTHER') NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `key` VARCHAR(255) NOT NULL,
    `status_enum` ENUM('TEMPORARY', 'UPLOADING', 'UPLOADED', 'FAILED') NULL DEFAULT 'TEMPORARY',

    UNIQUE INDEX `post_media_key_key`(`key`),
    INDEX `idx_post_media_post_id`(`post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_mentions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_post_mentions_post_id`(`post_id`),
    INDEX `idx_post_mentions_user_id`(`user_id`),
    UNIQUE INDEX `uq_post_mentions_post_user`(`post_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `follows` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `following_id` VARCHAR(191) NOT NULL,
    `is_following` BOOLEAN NOT NULL DEFAULT true,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `follows_user_id_idx`(`user_id`),
    INDEX `follows_following_id_idx`(`following_id`),
    INDEX `follows_following_id_status_idx`(`following_id`, `status`),
    UNIQUE INDEX `follows_user_id_following_id_key`(`user_id`, `following_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friend_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sender_id` VARCHAR(191) NOT NULL,
    `receiver_id` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `friend_requests_sender_id_idx`(`sender_id`),
    INDEX `friend_requests_receiver_id_idx`(`receiver_id`),
    UNIQUE INDEX `friend_requests_sender_id_receiver_id_key`(`sender_id`, `receiver_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `likes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `post_id` VARCHAR(191) NOT NULL,
    `is_like` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_likes_user_id`(`user_id`),
    INDEX `idx_likes_post_id`(`post_id`),
    UNIQUE INDEX `uq_likes_user_post`(`user_id`, `post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `topics_name_key`(`name`),
    INDEX `idx_topics_count`(`count`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topics_posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NOT NULL,
    `topic_id` INTEGER NULL,
    `private_topic_id` INTEGER NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_topics_posts_post_id`(`post_id`),
    INDEX `idx_topics_posts_topic_id`(`topic_id`),
    INDEX `idx_topics_posts_private_topic_id`(`private_topic_id`),
    INDEX `idx_topics_posts_post_topic`(`post_id`, `topic_id`),
    INDEX `idx_topics_posts_post_private_topic`(`post_id`, `private_topic_id`),
    UNIQUE INDEX `uq_topics_posts_post_id`(`post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(512) NOT NULL,
    `expire_at` DATETIME(3) NOT NULL,
    `session_id` VARCHAR(255) NOT NULL,
    `revoked_at` DATETIME(3) NULL,
    `user_agent` VARCHAR(512) NOT NULL DEFAULT 'unknown',
    `ip` VARCHAR(45) NOT NULL DEFAULT 'unknown',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `refresh_tokens_token_key`(`token`),
    INDEX `idx_refresh_tokens_user_id`(`user_id`),
    INDEX `idx_refresh_tokens_expire_at`(`expire_at`),
    INDEX `idx_refresh_tokens_session_id`(`session_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `error` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_email_logs_user_id`(`user_id`),
    INDEX `idx_email_logs_type`(`type`),
    INDEX `idx_email_logs_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `circles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `visibility` ENUM('PUBLIC', 'PRIVATE', 'CIRCLE') NOT NULL DEFAULT 'PRIVATE',
    `status_peak` BOOLEAN NOT NULL DEFAULT false,
    `create_by_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `circles_publicId_key`(`publicId`),
    INDEX `idx_circles_created_by`(`create_by_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `circle_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `circle_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `role` ENUM('OWNER', 'ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER',

    INDEX `idx_circle_members_circle_id`(`circle_id`),
    INDEX `idx_circle_members_user_id`(`user_id`),
    UNIQUE INDEX `uq_circle_members_circle_user`(`circle_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_quests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `karmaReward` INTEGER NOT NULL,
    `requirement` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `daily_quests_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_quest_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `quest_id` INTEGER NOT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `claimed_at` DATETIME(3) NULL,
    `date` DATE NOT NULL,

    UNIQUE INDEX `user_quest_logs_user_id_quest_id_date_key`(`user_id`, `quest_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `circle_energy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `circle_id` INTEGER NOT NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `exp` INTEGER NOT NULL DEFAULT 0,
    `current` INTEGER NOT NULL DEFAULT 500,
    `max` INTEGER NOT NULL DEFAULT 500,
    `peak` INTEGER NOT NULL DEFAULT 500,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_circle_energy_circle_id`(`circle_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hero_badges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `circle_id` INTEGER NOT NULL,
    `type` ENUM('HERO', 'LEGEND', 'KARMA_SACRIFICE', 'CPR_HERO', 'FOUNDER') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `karma_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `delta` INTEGER NOT NULL,
    `reason` ENUM('QUEST_REWARD', 'BURN_FOR_CIRCLE', 'ADMIN_GRANT') NOT NULL,
    `circle_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `karma_transactions_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `circle_post_quality_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `circle_id` INTEGER NOT NULL,
    `post_id` INTEGER NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `label` ENUM('MASTERPIECE', 'DEEP_TALK', 'SOLID', 'NEUTRAL', 'NOISE', 'TOXIC', 'PENDING') NOT NULL DEFAULT 'PENDING',
    `hp_delta` INTEGER NOT NULL DEFAULT 0,
    `exp_delta` INTEGER NOT NULL DEFAULT 0,
    `reason` TEXT NULL,
    `confidence` DECIMAL(3, 2) NULL,
    `is_toxic` BOOLEAN NOT NULL DEFAULT false,
    `is_spam` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_circle_post_quality_log_circle_id`(`circle_id`),
    INDEX `idx_circle_post_quality_log_post_id`(`post_id`),
    INDEX `idx_circle_post_quality_log_score`(`score`),
    INDEX `idx_circle_post_quality_log_label`(`label`),
    INDEX `idx_circle_post_quality_log_is_toxic`(`is_toxic`),
    INDEX `idx_circle_post_quality_log_is_spam`(`is_spam`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `circle_exp_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `circle_id` INTEGER NOT NULL,
    `post_id` INTEGER NULL,
    `exp_reason_enum` ENUM('POST_MASTERPIECE', 'POST_DEEP_TALK', 'POST_SOLID', 'POST_NEUTRAL', 'POST_NOISE', 'POST_TOXIC', 'CPR_SUCCESS', 'MEMBER_JOIN', 'CPR_SURVIVED', 'CPR_FAIL') NOT NULL,
    `exp_delta` INTEGER NOT NULL DEFAULT 0,
    `is_delta` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_circle_exp_log_circle_id`(`circle_id`),
    INDEX `idx_circle_exp_log_user_id`(`user_id`),
    INDEX `idx_circle_exp_log_post_id`(`post_id`),
    INDEX `idx_circle_exp_log_exp_reason`(`exp_reason_enum`),
    INDEX `idx_circle_exp_log_is_delta`(`is_delta`),
    INDEX `idx_circle_exp_log_created_at`(`created_at`),
    UNIQUE INDEX `uq_circle_exp_logs_circle_post_reason`(`circle_id`, `post_id`, `exp_reason_enum`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_karma` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `karma` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_user_karma_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_restrictions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `type_enum` ENUM('POSTING') NOT NULL,
    `reason` VARCHAR(255) NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_user_restrictions_user_id`(`user_id`),
    INDEX `idx_user_restrictions_type`(`type_enum`),
    INDEX `idx_user_restrictions_expires_at`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cpr_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `circleId` VARCHAR(191) NOT NULL,
    `activatedBy` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `resolved` BOOLEAN NOT NULL DEFAULT false,
    `target_comments` INTEGER NOT NULL DEFAULT 10,
    `current_comments` INTEGER NOT NULL DEFAULT 0,
    `post_id` INTEGER NULL,
    `success` BOOLEAN NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `circle_soul_stones` (
    `id` VARCHAR(191) NOT NULL,
    `circleId` VARCHAR(191) NOT NULL,
    `summary` TEXT NOT NULL,
    `peakHp` INTEGER NOT NULL,
    `livedDays` INTEGER NOT NULL,
    `topPostIds` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `circle_soul_stones_circleId_key`(`circleId`),
    INDEX `circle_soul_stones_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `circle_invitations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `circle_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `inviter_id` VARCHAR(191) NOT NULL,
    `resent_count` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_circle_invitations_circle_id`(`circle_id`),
    INDEX `idx_circle_invitations_user_id`(`user_id`),
    INDEX `idx_circle_invitations_inviter_id`(`inviter_id`),
    UNIQUE INDEX `uq_circle_invitations_circle_user`(`circle_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anti_spam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `action` ENUM('POST_CREATED', 'POST_DELETED', 'LIKE_CREATED', 'DISLIKE_CREATED', 'FLOW_FOLLOWER_CREATED', 'FOLLOW_FOLLOWING_CREATED', 'QUOTE_CREATED', 'QUOTE_DELETED', 'SHARE_CREATED', 'SHARE_DELETED') NOT NULL,
    `reason` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_anti_spam_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification_groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `recipient_id` VARCHAR(191) NOT NULL,
    `type` ENUM('POST', 'LIKE', 'FOLLOW', 'QUOTE', 'SHARE', 'MESSAGE', 'REPLY') NOT NULL,
    `target_type` VARCHAR(191) NOT NULL,
    `target_id` VARCHAR(191) NOT NULL,
    `actor_ids` JSON NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 1,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `last_actor_id` VARCHAR(191) NOT NULL,
    `last_event_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `origin_post` VARCHAR(191) NULL,

    UNIQUE INDEX `notification_groups_public_id_key`(`public_id`),
    INDEX `notification_groups_recipient_id_is_read_last_event_at_idx`(`recipient_id`, `is_read`, `last_event_at`),
    INDEX `notification_groups_recipient_id_type_target_type_target_id_idx`(`recipient_id`, `type`, `target_type`, `target_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_reporter_id_fkey` FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `verification_codes` ADD CONSTRAINT `verification_codes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message_groups` ADD CONSTRAINT `message_groups_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_message_groups` ADD CONSTRAINT `member_message_groups_messageGroupId_fkey` FOREIGN KEY (`messageGroupId`) REFERENCES `message_groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_message_groups` ADD CONSTRAINT `member_message_groups_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_message_group_id_fkey` FOREIGN KEY (`message_group_id`) REFERENCES `message_groups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_origin_post_id_fkey` FOREIGN KEY (`origin_post_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_root_post_id_fkey` FOREIGN KEY (`root_post_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_media` ADD CONSTRAINT `post_media_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_mentions` ADD CONSTRAINT `post_mentions_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_following_id_fkey` FOREIGN KEY (`following_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend_requests` ADD CONSTRAINT `friend_requests_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend_requests` ADD CONSTRAINT `friend_requests_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `topics_posts` ADD CONSTRAINT `topics_posts_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `topics_posts` ADD CONSTRAINT `topics_posts_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `topics_posts` ADD CONSTRAINT `topics_posts_private_topic_id_fkey` FOREIGN KEY (`private_topic_id`) REFERENCES `topics`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email_logs` ADD CONSTRAINT `email_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circles` ADD CONSTRAINT `circles_create_by_id_fkey` FOREIGN KEY (`create_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_members` ADD CONSTRAINT `circle_members_circle_id_fkey` FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_members` ADD CONSTRAINT `circle_members_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quest_logs` ADD CONSTRAINT `user_quest_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quest_logs` ADD CONSTRAINT `user_quest_logs_quest_id_fkey` FOREIGN KEY (`quest_id`) REFERENCES `daily_quests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_energy` ADD CONSTRAINT `circle_energy_circle_id_fkey` FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hero_badges` ADD CONSTRAINT `hero_badges_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hero_badges` ADD CONSTRAINT `hero_badges_circle_id_fkey` FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `karma_transactions` ADD CONSTRAINT `karma_transactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_post_quality_logs` ADD CONSTRAINT `circle_post_quality_logs_circle_id_fkey` FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_post_quality_logs` ADD CONSTRAINT `circle_post_quality_logs_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_exp_logs` ADD CONSTRAINT `circle_exp_logs_circle_id_fkey` FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_exp_logs` ADD CONSTRAINT `circle_exp_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_exp_logs` ADD CONSTRAINT `circle_exp_logs_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_karma` ADD CONSTRAINT `user_karma_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_restrictions` ADD CONSTRAINT `user_restrictions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cpr_sessions` ADD CONSTRAINT `cpr_sessions_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `circles`(`publicId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_soul_stones` ADD CONSTRAINT `circle_soul_stones_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `circles`(`publicId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_invitations` ADD CONSTRAINT `circle_invitations_circle_id_fkey` FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_invitations` ADD CONSTRAINT `circle_invitations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_invitations` ADD CONSTRAINT `circle_invitations_inviter_id_fkey` FOREIGN KEY (`inviter_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anti_spam` ADD CONSTRAINT `anti_spam_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification_groups` ADD CONSTRAINT `notification_groups_last_actor_id_fkey` FOREIGN KEY (`last_actor_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification_groups` ADD CONSTRAINT `notification_groups_target_id_fkey` FOREIGN KEY (`target_id`) REFERENCES `posts`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification_groups` ADD CONSTRAINT `notification_groups_origin_post_fkey` FOREIGN KEY (`origin_post`) REFERENCES `posts`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;
