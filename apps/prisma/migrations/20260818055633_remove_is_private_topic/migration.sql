/*
  Warnings:

  - You are about to drop the column `is_public` on the `topics_posts` table. All the data in the column will be lost.
  - You are about to drop the column `private_topic_id` on the `topics_posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `topics_posts` DROP FOREIGN KEY `topics_posts_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `topics_posts` DROP FOREIGN KEY `topics_posts_private_topic_id_fkey`;

-- DropIndex
DROP INDEX `idx_topics_posts_post_private_topic` ON `topics_posts`;

-- DropIndex
DROP INDEX `idx_topics_posts_private_topic_id` ON `topics_posts`;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `is_decline` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `topics_posts` DROP COLUMN `is_public`,
    DROP COLUMN `private_topic_id`;

-- CreateTable
CREATE TABLE `overview_declines` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `context` TEXT NOT NULL,
    `reason` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_overview_declines_post_id`(`post_id`),
    INDEX `idx_overview_declines_user_id`(`user_id`),
    UNIQUE INDEX `uq_overview_declines_post_user`(`post_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `overview_declines` ADD CONSTRAINT `overview_declines_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `overview_declines` ADD CONSTRAINT `overview_declines_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
