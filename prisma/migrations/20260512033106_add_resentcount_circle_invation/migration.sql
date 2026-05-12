/*
  Warnings:

  - You are about to drop the `invitation_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `invitation_requests` DROP FOREIGN KEY `invitation_requests_circle_id_fkey`;

-- DropForeignKey
ALTER TABLE `invitation_requests` DROP FOREIGN KEY `invitation_requests_user_id_fkey`;

-- AlterTable
ALTER TABLE `circle_invitations` ADD COLUMN `resent_count` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `invitation_requests`;
