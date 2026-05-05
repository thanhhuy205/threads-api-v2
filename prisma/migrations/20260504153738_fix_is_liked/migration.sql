/*
  Warnings:

  - You are about to drop the column `isLike` on the `likes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `likes` DROP COLUMN `isLike`,
    ADD COLUMN `is_like` BOOLEAN NOT NULL DEFAULT false;
