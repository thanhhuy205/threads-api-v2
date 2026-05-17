/*
  Warnings:

  - You are about to drop the column `userId` on the `notification_groups` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `notification_groups` DROP FOREIGN KEY `notification_groups_userId_fkey`;

-- DropIndex
DROP INDEX `notification_groups_userId_fkey` ON `notification_groups`;

-- AlterTable
ALTER TABLE `notification_groups` DROP COLUMN `userId`;

-- AddForeignKey
ALTER TABLE `notification_groups` ADD CONSTRAINT `notification_groups_last_actor_id_fkey` FOREIGN KEY (`last_actor_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
