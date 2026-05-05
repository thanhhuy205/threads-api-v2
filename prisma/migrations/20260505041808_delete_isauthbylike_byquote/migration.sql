/*
  Warnings:

  - You are about to drop the column `is_liked_by_auth` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `is_reposted_by_auth` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `is_saved_by_auth` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `posts` DROP COLUMN `is_liked_by_auth`,
    DROP COLUMN `is_reposted_by_auth`,
    DROP COLUMN `is_saved_by_auth`;
