-- AlterTable
ALTER TABLE `notification_groups` MODIFY `type` ENUM('POST', 'LIKE', 'FOLLOW', 'QUOTE', 'SHARE', 'MESSAGE', 'REPLY', 'MENTION', 'INVITATION', 'JOIN_REQUEST') NOT NULL;

-- CreateIndex
CREATE FULLTEXT INDEX `idx_posts_content_fulltext` ON `posts`(`content`);
