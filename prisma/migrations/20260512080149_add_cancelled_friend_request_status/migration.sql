/*
  Warnings:

  - You are about to drop the column `is_ghost` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `friend_requests` MODIFY `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `is_ghost`;
