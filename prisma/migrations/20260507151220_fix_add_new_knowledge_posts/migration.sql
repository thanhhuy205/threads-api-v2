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

-- AddForeignKey
ALTER TABLE `knowledge_post_comments` ADD CONSTRAINT `knowledge_post_comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_post_comments` ADD CONSTRAINT `knowledge_post_comments_knowledge_post_id_fkey` FOREIGN KEY (`knowledge_post_id`) REFERENCES `knowledge_posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_rankings` ADD CONSTRAINT `knowledge_rankings_knowledge_post_id_fkey` FOREIGN KEY (`knowledge_post_id`) REFERENCES `knowledge_posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_rankings` ADD CONSTRAINT `knowledge_rankings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
