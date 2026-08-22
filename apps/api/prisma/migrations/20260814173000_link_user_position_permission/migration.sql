-- Drop the legacy position stored directly on users. Position assignments now
-- live in user_positions and point at the exact permission grant.
ALTER TABLE `users` DROP COLUMN `position`;

ALTER TABLE `user_positions`
  DROP INDEX `uq_user_positions_user_id_position`,
  ADD COLUMN `position_permission_id` INTEGER NOT NULL;

CREATE UNIQUE INDEX `uq_user_positions_user_id_position_permission_id`
  ON `user_positions` (`user_id`, `position_permission_id`);

CREATE INDEX `idx_user_positions_position_permission_id`
  ON `user_positions` (`position_permission_id`);

ALTER TABLE `user_positions`
  ADD CONSTRAINT `user_positions_position_permission_id_fkey`
  FOREIGN KEY (`position_permission_id`) REFERENCES `position_permissions` (`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE;
