/*
  Warnings:

  - You are about to drop the `anti_spam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cpr_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `email_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `anti_spam` DROP FOREIGN KEY `anti_spam_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `cpr_sessions` DROP FOREIGN KEY `cpr_sessions_circleId_fkey`;

-- DropForeignKey
ALTER TABLE `email_logs` DROP FOREIGN KEY `email_logs_user_id_fkey`;

-- AlterTable
ALTER TABLE `post_media` MODIFY `type_enum` ENUM('IMAGE', 'VIDEO', 'HLS', 'VOICE', 'GIF', 'OTHER') NULL;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `is_survey` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `anti_spam`;

-- DropTable
DROP TABLE `cpr_sessions`;

-- DropTable
DROP TABLE `email_logs`;

-- CreateTable
CREATE TABLE `polls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_polls_post_id`(`post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `poll_options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `poll_id` INTEGER NOT NULL,
    `option_text` VARCHAR(255) NOT NULL,
    `votes_count` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_poll_options_poll_id`(`poll_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `polls` ADD CONSTRAINT `polls_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `poll_options` ADD CONSTRAINT `poll_options_poll_id_fkey` FOREIGN KEY (`poll_id`) REFERENCES `polls`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
