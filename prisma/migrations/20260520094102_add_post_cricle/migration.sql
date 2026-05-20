/*
  Warnings:

  - Added the required column `label` to the `circle_post_quality_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `circle_post_quality_logs` ADD COLUMN `confidence` DECIMAL(3, 2) NULL,
    ADD COLUMN `exp_delta` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `is_spam` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_toxic` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `label` ENUM('MASTERPIECE', 'DEEP_TALK', 'SOLID', 'NEUTRAL', 'NOISE', 'TOXIC') NOT NULL,
    ADD COLUMN `reason` TEXT NULL;

-- AlterTable
ALTER TABLE `posts` MODIFY `type` ENUM('POST', 'REPLY', 'REPOST', 'QUOTE', 'CIRCLE') NOT NULL DEFAULT 'POST';

-- CreateIndex
CREATE INDEX `idx_circle_post_quality_log_score` ON `circle_post_quality_logs`(`score`);

-- CreateIndex
CREATE INDEX `idx_circle_post_quality_log_label` ON `circle_post_quality_logs`(`label`);

-- CreateIndex
CREATE INDEX `idx_circle_post_quality_log_is_toxic` ON `circle_post_quality_logs`(`is_toxic`);

-- CreateIndex
CREATE INDEX `idx_circle_post_quality_log_is_spam` ON `circle_post_quality_logs`(`is_spam`);
