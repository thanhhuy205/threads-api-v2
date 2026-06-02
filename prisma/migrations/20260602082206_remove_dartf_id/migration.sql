/*
  Warnings:

  - You are about to drop the column `draft_id` on the `webhook_preview_images` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `idx_webhook_preview_images_draft_id` ON `webhook_preview_images`;

-- AlterTable
ALTER TABLE `webhook_preview_images` DROP COLUMN `draft_id`;

-- CreateIndex
CREATE INDEX `idx_webhook_preview_images_draft_id` ON `webhook_preview_images`(`generation_id`);
