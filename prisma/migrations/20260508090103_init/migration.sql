-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NULL,
    `bio` TEXT NULL,
    `avatar` VARCHAR(255) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `verified_at` DATETIME(3) NULL,
    `status` ENUM('ACTIVE', 'SUSPENDED', 'BANNED', 'DEACTIVATED') NOT NULL DEFAULT 'ACTIVE',
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
CREATE TABLE `posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `type` ENUM('POST', 'REPLY', 'REPOST', 'QUOTE') NOT NULL DEFAULT 'POST',
    `parent_id` INTEGER NULL,
    `origin_post_id` INTEGER NULL,
    `root_post_id` INTEGER NULL,
    `parent_public_id` VARCHAR(191) NULL,
    `origin_public_id` VARCHAR(191) NULL,
    `root_public_id` VARCHAR(191) NULL,
    `user_snapshot` JSON NULL,
    `reply_permission` VARCHAR(50) NOT NULL DEFAULT 'everyone',
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
CREATE TABLE `knowledge_posts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `learning_goal` TEXT NOT NULL,
    `common_confusion` TEXT NOT NULL,
    `core_explanation` TEXT NOT NULL,
    `understanding_check` TEXT NOT NULL,
    `summary` VARCHAR(255) NULL,
    `cover_image` VARCHAR(2048) NULL,
    `tags` JSON NULL,
    `difficulty_level` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL DEFAULT 'BEGINNER',
    `content_format` ENUM('PLAIN', 'MARKDOWN') NOT NULL DEFAULT 'PLAIN',
    `reading_time` INTEGER NOT NULL DEFAULT 3,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `approval_status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `knowledge_reason_id` INTEGER NULL,

    INDEX `idx_knowledge_posts_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knowledge_medias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `knowledge_post_id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(2048) NOT NULL,
    `type` ENUM('IMAGE', 'VIDEO', 'GIF', 'OTHER') NOT NULL,
    `caption` VARCHAR(500) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_knowledge_medias_post_id`(`knowledge_post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knowledge_sources` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `knowledge_post_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `url` VARCHAR(2048) NULL,
    `description` VARCHAR(500) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_knowledge_sources_post_id`(`knowledge_post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knowledge_bookmarks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `knowledge_post_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_knowledge_bookmarks_user_id`(`user_id`),
    INDEX `idx_knowledge_bookmarks_post_id`(`knowledge_post_id`),
    UNIQUE INDEX `uq_knowledge_bookmarks_user_post`(`user_id`, `knowledge_post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knowledge_post_comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `knowledge_post_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `knowledge_post_comments_public_id_key`(`public_id`),
    INDEX `idx_knowledge_post_comments_post_id`(`knowledge_post_id`),
    INDEX `idx_knowledge_post_comments_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knowledge_rankings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `knowledge_post_id` VARCHAR(191) NOT NULL,
    `criteria_enum` ENUM('CORRECTNESS', 'USEFULNESS', 'EXCELLENCE', 'INCOMPREHENSIBILITY', 'SUSPICIOUSNESS') NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_knowledge_rankings_post_id`(`knowledge_post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knowledge_reasons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `knowledge_post_id` VARCHAR(191) NOT NULL,
    `content_type` ENUM('KNOWLEDGE', 'OPINION', 'SPAM', 'SCAM') NOT NULL,
    `trust_score` INTEGER NOT NULL,
    `risk_level` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
    `reason` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_knowledge_reasons_post_id`(`knowledge_post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knowledge_understands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `knowledge_post_id` VARCHAR(191) NOT NULL,
    `is_understood` BOOLEAN NOT NULL DEFAULT false,
    `feedback` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_knowledge_understands_user_id`(`user_id`),
    INDEX `idx_knowledge_understands_post_id`(`knowledge_post_id`),
    UNIQUE INDEX `uq_knowledge_understands_user_post`(`user_id`, `knowledge_post_id`),
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
    `key` VARCHAR(255) NULL,
    `status_enum` ENUM('TEMPORARY', 'UPLOADING', 'UPLOADED', 'FAILED') NULL DEFAULT 'TEMPORARY',

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
    `name` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `visibility` ENUM('PUBLIC', 'PRIVATE', 'CIRCLE') NOT NULL DEFAULT 'PRIVATE',
    `create_by_id` VARCHAR(191) NOT NULL,

    INDEX `idx_circles_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitation_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `circle_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_invitation_requests_circle_id`(`circle_id`),
    INDEX `idx_invitation_requests_user_id`(`user_id`),
    UNIQUE INDEX `uq_invitation_requests_circle_user`(`circle_id`, `user_id`),
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
CREATE TABLE `circle_invitations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `circle_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `inviter_id` VARCHAR(191) NOT NULL,
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
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_notifications_user_id`(`user_id`),
    INDEX `idx_notifications_is_read`(`is_read`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `verification_codes` ADD CONSTRAINT `verification_codes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_origin_post_id_fkey` FOREIGN KEY (`origin_post_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_root_post_id_fkey` FOREIGN KEY (`root_post_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_posts` ADD CONSTRAINT `knowledge_posts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_posts` ADD CONSTRAINT `knowledge_posts_knowledge_reason_id_fkey` FOREIGN KEY (`knowledge_reason_id`) REFERENCES `knowledge_reasons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_medias` ADD CONSTRAINT `knowledge_medias_knowledge_post_id_fkey` FOREIGN KEY (`knowledge_post_id`) REFERENCES `knowledge_posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_sources` ADD CONSTRAINT `knowledge_sources_knowledge_post_id_fkey` FOREIGN KEY (`knowledge_post_id`) REFERENCES `knowledge_posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_bookmarks` ADD CONSTRAINT `knowledge_bookmarks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_bookmarks` ADD CONSTRAINT `knowledge_bookmarks_knowledge_post_id_fkey` FOREIGN KEY (`knowledge_post_id`) REFERENCES `knowledge_posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_post_comments` ADD CONSTRAINT `knowledge_post_comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_post_comments` ADD CONSTRAINT `knowledge_post_comments_knowledge_post_id_fkey` FOREIGN KEY (`knowledge_post_id`) REFERENCES `knowledge_posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_rankings` ADD CONSTRAINT `knowledge_rankings_knowledge_post_id_fkey` FOREIGN KEY (`knowledge_post_id`) REFERENCES `knowledge_posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_rankings` ADD CONSTRAINT `knowledge_rankings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_understands` ADD CONSTRAINT `knowledge_understands_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_understands` ADD CONSTRAINT `knowledge_understands_knowledge_post_id_fkey` FOREIGN KEY (`knowledge_post_id`) REFERENCES `knowledge_posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_media` ADD CONSTRAINT `post_media_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_mentions` ADD CONSTRAINT `post_mentions_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_following_id_fkey` FOREIGN KEY (`following_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE `invitation_requests` ADD CONSTRAINT `invitation_requests_circle_id_fkey` FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation_requests` ADD CONSTRAINT `invitation_requests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_members` ADD CONSTRAINT `circle_members_circle_id_fkey` FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_members` ADD CONSTRAINT `circle_members_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_invitations` ADD CONSTRAINT `circle_invitations_circle_id_fkey` FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_invitations` ADD CONSTRAINT `circle_invitations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_invitations` ADD CONSTRAINT `circle_invitations_inviter_id_fkey` FOREIGN KEY (`inviter_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anti_spam` ADD CONSTRAINT `anti_spam_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
