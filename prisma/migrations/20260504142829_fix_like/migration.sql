-- AlterTable
ALTER TABLE `likes` ADD COLUMN `isLike` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `is_liked_by_auth` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_reposted_by_auth` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_saved_by_auth` BOOLEAN NOT NULL DEFAULT false;
