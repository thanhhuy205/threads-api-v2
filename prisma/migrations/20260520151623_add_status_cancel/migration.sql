/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `circle_exp_logs` will be added. If there are existing duplicate values, this will fail.
  - The required column `public_id` was added to the `circle_exp_logs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `circle_exp_logs` ADD COLUMN `public_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `circle_invitations` MODIFY `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `posts` MODIFY `type` ENUM('POST', 'REPLY', 'REPOST', 'QUOTE', 'CIRCLE', 'CIRCLE_REPLY') NOT NULL DEFAULT 'POST';

-- CreateIndex
CREATE UNIQUE INDEX `circle_exp_logs_public_id_key` ON `circle_exp_logs`(`public_id`);
