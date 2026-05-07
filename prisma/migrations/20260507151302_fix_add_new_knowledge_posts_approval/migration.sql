/*
  Warnings:

  - You are about to drop the column `approvalStatus` on the `knowledge_posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `knowledge_posts` DROP COLUMN `approvalStatus`,
    ADD COLUMN `approval_status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';
