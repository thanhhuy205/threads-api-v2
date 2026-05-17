/*
  Warnings:

  - You are about to drop the column `post_id` on the `notification_groups` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `notification_groups` DROP FOREIGN KEY `notification_groups_post_id_fkey`;

-- DropIndex
DROP INDEX `notification_groups_post_id_fkey` ON `notification_groups`;

-- AlterTable
ALTER TABLE `notification_groups` DROP COLUMN `post_id`,
    ADD COLUMN `origin_post` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `notification_groups` ADD CONSTRAINT `notification_groups_origin_post_fkey` FOREIGN KEY (`origin_post`) REFERENCES `posts`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;
