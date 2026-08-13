/*
  Warnings:

  - The values [REPLY,REPOST,QUOTE,DISCUSSION,KNOWLEDGE,QUESTION,INCIDENT,FEEDBACK] on the enum `posts_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `visibility` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(8))` to `Enum(EnumId(7))`.
  - You are about to drop the column `followers_count` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `following_count` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `posts_count` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `follows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `friend_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `follows` DROP FOREIGN KEY `follows_following_id_fkey`;

-- DropForeignKey
ALTER TABLE `follows` DROP FOREIGN KEY `follows_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `friend_requests` DROP FOREIGN KEY `friend_requests_receiver_id_fkey`;

-- DropForeignKey
ALTER TABLE `friend_requests` DROP FOREIGN KEY `friend_requests_sender_id_fkey`;

-- DropIndex
DROP INDEX `idx_posts_public_id` ON `posts`;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `commentsEnabled` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `is_pinned` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `published_at` DATETIME(3) NULL,
    ADD COLUMN `requires_acknowledgement` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `type` ENUM('POST', 'ANNOUNCEMENT') NOT NULL DEFAULT 'POST',
    MODIFY `visibility` ENUM('WORKSPACE', 'GROUP', 'CUSTOM', 'ONLY_ME') NOT NULL DEFAULT 'WORKSPACE';

-- AlterTable
ALTER TABLE `users` DROP COLUMN `followers_count`,
    DROP COLUMN `following_count`,
    DROP COLUMN `posts_count`;

-- DropTable
DROP TABLE `follows`;

-- DropTable
DROP TABLE `friend_requests`;

-- CreateTable
CREATE TABLE `announcement_receipts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `read_at` DATETIME(3) NULL,
    `acknowledged_at` DATETIME(3) NULL,

    INDEX `announcement_receipts_user_id_read_at_idx`(`user_id`, `read_at`),
    UNIQUE INDEX `announcement_receipts_post_id_user_id_key`(`post_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `announcement_receipts` ADD CONSTRAINT `announcement_receipts_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `announcement_receipts` ADD CONSTRAINT `announcement_receipts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
