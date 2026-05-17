/*
  Warnings:

  - Added the required column `post_id` to the `notification_groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notification_groups` ADD COLUMN `post_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `notification_groups` ADD CONSTRAINT `notification_groups_target_id_fkey` FOREIGN KEY (`target_id`) REFERENCES `posts`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification_groups` ADD CONSTRAINT `notification_groups_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
