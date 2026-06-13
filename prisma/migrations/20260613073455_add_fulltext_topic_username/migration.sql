-- CreateIndex
CREATE INDEX `idx_topics_name` ON `topics`(`name`);

-- CreateIndex
CREATE FULLTEXT INDEX `idx_topics_name_fulltext` ON `topics`(`name`);

-- CreateIndex
CREATE INDEX `idx_users_email` ON `users`(`email`);

-- CreateIndex
CREATE INDEX `idx_users_username` ON `users`(`username`);

-- CreateIndex
CREATE FULLTEXT INDEX `idx_users_username_fulltext` ON `users`(`username`);

-- CreateIndex
CREATE FULLTEXT INDEX `idx_users_email_fulltext` ON `users`(`email`);
