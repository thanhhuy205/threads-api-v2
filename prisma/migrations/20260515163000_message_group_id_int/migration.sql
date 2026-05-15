-- DropForeignKey
ALTER TABLE `member_message_groups` DROP FOREIGN KEY `member_message_groups_messageGroupId_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_message_group_id_fkey`;

-- AlterTable
ALTER TABLE `message_groups`
    DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `member_message_groups`
    MODIFY `messageGroupId` INTEGER NULL;

-- AlterTable
ALTER TABLE `messages`
    MODIFY `message_group_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `member_message_groups` ADD CONSTRAINT `member_message_groups_messageGroupId_fkey` FOREIGN KEY (`messageGroupId`) REFERENCES `message_groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_message_group_id_fkey` FOREIGN KEY (`message_group_id`) REFERENCES `message_groups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
