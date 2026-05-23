/*
  Warnings:

  - A unique constraint covering the columns `[tokenHash]` on the table `circle_invitations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `circle_invitations` DROP FOREIGN KEY `circle_invitations_user_id_fkey`;

-- AlterTable
ALTER TABLE `circle_invitations` ADD COLUMN `email` VARCHAR(255) NULL,
    ADD COLUMN `role` ENUM('OWNER', 'ADMIN', 'MEMBER') NULL DEFAULT 'MEMBER',
    ADD COLUMN `tokenHash` VARCHAR(100) NULL,
    MODIFY `user_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `circle_invitations_tokenHash_key` ON `circle_invitations`(`tokenHash`);

-- AddForeignKey
ALTER TABLE `circle_invitations` ADD CONSTRAINT `circle_invitations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
