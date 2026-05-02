-- Deduplicate by user_id: keep the most recently updated row (tie-breaker: highest id)
DELETE ui_old
FROM `user_intents` ui_old
JOIN `user_intents` ui_keep
    ON ui_old.`user_id` = ui_keep.`user_id`
    AND (
        ui_old.`updated_at` < ui_keep.`updated_at`
        OR (ui_old.`updated_at` = ui_keep.`updated_at` AND ui_old.`id` < ui_keep.`id`)
    );

-- Enforce one row per user for upsert-by-user_id
CREATE UNIQUE INDEX `uq_user_intents_user_id` ON `user_intents`(`user_id`);
