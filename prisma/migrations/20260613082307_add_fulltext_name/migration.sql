-- CreateIndex
CREATE INDEX `idx_users_name` ON `users`(`name`);

-- CreateIndex
CREATE FULLTEXT INDEX `idx_users_name_fulltext` ON `users`(`name`);
