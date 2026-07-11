/*
  Warnings:

  - You are about to drop the `notification_groups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `notification_groups` DROP FOREIGN KEY `notification_groups_last_actor_id_fkey`;

-- DropForeignKey
ALTER TABLE `notification_groups` DROP FOREIGN KEY `notification_groups_origin_post_fkey`;

-- DropTable
DROP TABLE `notification_groups`;

-- CreateIndex
CREATE INDEX `idx_posts_public_id` ON `posts`(`public_id`);
