-- CreateTable
CREATE TABLE `knowledge_posts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `learning_goal` TEXT NOT NULL,
    `common_confusion` TEXT NOT NULL,
    `core_explanation` TEXT NOT NULL,
    `understanding_check` TEXT NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `approvalStatus` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `knowledgeReasonId` INTEGER NOT NULL,

    INDEX `idx_knowledge_posts_user_id`(`user_id`),
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

-- AddForeignKey
ALTER TABLE `knowledge_posts` ADD CONSTRAINT `knowledge_posts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_posts` ADD CONSTRAINT `knowledge_posts_knowledgeReasonId_fkey` FOREIGN KEY (`knowledgeReasonId`) REFERENCES `knowledge_reasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_understands` ADD CONSTRAINT `knowledge_understands_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_understands` ADD CONSTRAINT `knowledge_understands_knowledge_post_id_fkey` FOREIGN KEY (`knowledge_post_id`) REFERENCES `knowledge_posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
