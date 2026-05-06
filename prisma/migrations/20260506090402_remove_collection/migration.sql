/*
  Warnings:

  - You are about to drop the `collection_posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `collections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `collection_posts` DROP FOREIGN KEY `collection_posts_collection_id_fkey`;

-- DropForeignKey
ALTER TABLE `collection_posts` DROP FOREIGN KEY `collection_posts_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `collections` DROP FOREIGN KEY `collections_user_id_fkey`;

-- DropTable
DROP TABLE `collection_posts`;

-- DropTable
DROP TABLE `collections`;
