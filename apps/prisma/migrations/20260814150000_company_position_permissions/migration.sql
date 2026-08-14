-- Expand the legacy user position enum so existing databases can store all
-- company positions even though application reads now use user_positions.
ALTER TABLE `users`
  MODIFY `position` ENUM(
    'SOFTWARE_ENGINEER',
    'SENIOR_SOFTWARE_ENGINEER',
    'INTERN_SOFTWARE_ENGINEER',
    'TECH_LEAD',
    'DATA_SCIENTIST',
    'PRODUCT_MANAGER',
    'DESIGNER',
    'HR',
    'MARKETING_SPECIALIST',
    'SALES_REPRESENTATIVE',
    'CUSTOMER_SUPPORT',
    'CONTENT_CREATOR',
    'BUSINESS_ANALYST',
    'CTO',
    'CEO',
    'FOUNDER',
    'OTHER'
  ) NULL DEFAULT 'OTHER';

CREATE TABLE `user_positions` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(191) NOT NULL,
  `position` ENUM(
    'SOFTWARE_ENGINEER',
    'SENIOR_SOFTWARE_ENGINEER',
    'INTERN_SOFTWARE_ENGINEER',
    'TECH_LEAD',
    'DATA_SCIENTIST',
    'PRODUCT_MANAGER',
    'DESIGNER',
    'HR',
    'MARKETING_SPECIALIST',
    'SALES_REPRESENTATIVE',
    'CUSTOMER_SUPPORT',
    'CONTENT_CREATOR',
    'BUSINESS_ANALYST',
    'CTO',
    'CEO',
    'FOUNDER',
    'OTHER'
  ) NOT NULL DEFAULT 'OTHER',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  UNIQUE INDEX `uq_user_positions_user_id_position` (`user_id`, `position`),
  INDEX `idx_user_positions_user_id` (`user_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `position_permissions` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `position` ENUM(
    'SOFTWARE_ENGINEER',
    'SENIOR_SOFTWARE_ENGINEER',
    'INTERN_SOFTWARE_ENGINEER',
    'TECH_LEAD',
    'DATA_SCIENTIST',
    'PRODUCT_MANAGER',
    'DESIGNER',
    'HR',
    'MARKETING_SPECIALIST',
    'SALES_REPRESENTATIVE',
    'CUSTOMER_SUPPORT',
    'CONTENT_CREATOR',
    'BUSINESS_ANALYST',
    'CTO',
    'CEO',
    'FOUNDER',
    'OTHER'
  ) NOT NULL,
  `permission_id` VARCHAR(191) NOT NULL,
  `scope` ENUM('WORKSPACE', 'GROUP') NOT NULL DEFAULT 'WORKSPACE',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  UNIQUE INDEX `uq_position_permissions_position_permission_scope` (`position`, `permission_id`, `scope`),
  INDEX `idx_position_permissions_permission_id` (`permission_id`),
  INDEX `idx_position_permissions_position_scope` (`position`, `scope`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `group_teams` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `public_id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  `created_by_id` VARCHAR(191) NOT NULL,

  UNIQUE INDEX `group_teams_public_id_key` (`public_id`),
  UNIQUE INDEX `group_teams_name_key` (`name`),
  INDEX `idx_group_teams_name` (`name`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `user_teams` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(191) NOT NULL,
  `team_id` INTEGER NOT NULL,
  `position` ENUM(
    'SOFTWARE_ENGINEER',
    'SENIOR_SOFTWARE_ENGINEER',
    'INTERN_SOFTWARE_ENGINEER',
    'TECH_LEAD',
    'DATA_SCIENTIST',
    'PRODUCT_MANAGER',
    'DESIGNER',
    'HR',
    'MARKETING_SPECIALIST',
    'SALES_REPRESENTATIVE',
    'CUSTOMER_SUPPORT',
    'CONTENT_CREATOR',
    'BUSINESS_ANALYST',
    'CTO',
    'CEO',
    'FOUNDER',
    'OTHER'
  ) NULL DEFAULT 'OTHER',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  UNIQUE INDEX `uq_user_teams_user_id_team_id` (`user_id`, `team_id`),
  INDEX `idx_user_teams_user_id` (`user_id`),
  INDEX `idx_user_teams_team_id` (`team_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `posts`
  ADD COLUMN `expires_at` DATETIME(3) NULL,
  ADD COLUMN `group_team_id` INTEGER NULL;

CREATE INDEX `posts_group_team_id_idx` ON `posts` (`group_team_id`);

ALTER TABLE `user_positions`
  ADD CONSTRAINT `user_positions_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `position_permissions`
  ADD CONSTRAINT `position_permissions_permission_id_fkey`
  FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `group_teams`
  ADD CONSTRAINT `group_teams_created_by_id_fkey`
  FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `user_teams`
  ADD CONSTRAINT `user_teams_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `user_teams`
  ADD CONSTRAINT `user_teams_team_id_fkey`
  FOREIGN KEY (`team_id`) REFERENCES `group_teams` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `posts`
  ADD CONSTRAINT `posts_group_team_id_fkey`
  FOREIGN KEY (`group_team_id`) REFERENCES `group_teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
