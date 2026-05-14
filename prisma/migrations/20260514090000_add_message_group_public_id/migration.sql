-- Add a public cursor/id for message groups. Existing rows use their cuid primary key
-- as the initial public id so the NOT NULL + unique constraint can be applied safely.
ALTER TABLE `message_groups` ADD COLUMN `public_id` VARCHAR(191) NULL;

UPDATE `message_groups`
SET `public_id` = `id`
WHERE `public_id` IS NULL;

ALTER TABLE `message_groups` MODIFY `public_id` VARCHAR(191) NOT NULL;

CREATE UNIQUE INDEX `message_groups_public_id_key` ON `message_groups`(`public_id`);

CREATE UNIQUE INDEX `uq_member_message_groups_group_user` ON `member_message_groups`(`messageGroupId`, `user_id`);
