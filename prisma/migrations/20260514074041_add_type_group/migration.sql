-- DropIndex
DROP INDEX `message_groups_name_key` ON `message_groups`;

-- AlterTable
ALTER TABLE `message_groups` ADD COLUMN `groupType` ENUM('PRIVATE', 'CROWD') NOT NULL DEFAULT 'PRIVATE',
    MODIFY `name` VARCHAR(255) NOT NULL DEFAULT '';
