-- AlterTable
ALTER TABLE `knowledge_posts` ADD COLUMN `content_format` ENUM('PLAIN', 'MARKDOWN') NOT NULL DEFAULT 'PLAIN',
    ADD COLUMN `cover_image` VARCHAR(2048) NULL,
    ADD COLUMN `difficulty_level` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL DEFAULT 'BEGINNER',
    ADD COLUMN `reading_time` INTEGER NOT NULL DEFAULT 3,
    ADD COLUMN `summary` VARCHAR(255) NULL,
    ADD COLUMN `tags` JSON NULL;

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

-- AddForeignKey
ALTER TABLE `knowledge_medias` ADD CONSTRAINT `knowledge_medias_knowledge_post_id_fkey` FOREIGN KEY (`knowledge_post_id`) REFERENCES `knowledge_posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_sources` ADD CONSTRAINT `knowledge_sources_knowledge_post_id_fkey` FOREIGN KEY (`knowledge_post_id`) REFERENCES `knowledge_posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_bookmarks` ADD CONSTRAINT `knowledge_bookmarks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_bookmarks` ADD CONSTRAINT `knowledge_bookmarks_knowledge_post_id_fkey` FOREIGN KEY (`knowledge_post_id`) REFERENCES `knowledge_posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
