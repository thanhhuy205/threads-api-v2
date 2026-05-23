-- AlterTable
ALTER TABLE `posts` ADD COLUMN `is_hidden` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `reports` ADD COLUMN `assistant_note` TEXT NULL,
    ADD COLUMN `confidence` DECIMAL(3, 2) NULL,
    MODIFY `target_type` ENUM('POST', 'USER', 'CIRCLE') NOT NULL;
