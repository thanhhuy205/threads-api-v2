/*
  Warnings:

  - The values [CIRCLE] on the enum `circles_visibility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `circles` MODIFY `visibility` ENUM('PUBLIC', 'PRIVATE') NOT NULL DEFAULT 'PRIVATE';

-- AddForeignKey
ALTER TABLE `post_mentions` ADD CONSTRAINT `post_mentions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
