-- Permanently remove Circle posts and their records in shared tables.
CREATE TEMPORARY TABLE `_removed_circle_posts` AS
SELECT `id`, `public_id`
FROM `posts`
WHERE `type` IN ('CIRCLE', 'CIRCLE_REPLY');

DELETE `v`
FROM `votes` AS `v`
INNER JOIN `polls` AS `p` ON `p`.`id` = `v`.`poll_id`
INNER JOIN `_removed_circle_posts` AS `rp` ON `rp`.`id` = `p`.`post_id`;
DELETE `po`
FROM `poll_options` AS `po`
INNER JOIN `polls` AS `p` ON `p`.`id` = `po`.`poll_id`
INNER JOIN `_removed_circle_posts` AS `rp` ON `rp`.`id` = `p`.`post_id`;
DELETE `p`
FROM `polls` AS `p`
INNER JOIN `_removed_circle_posts` AS `rp` ON `rp`.`id` = `p`.`post_id`;
DELETE `pi`
FROM `post_interactions` AS `pi`
INNER JOIN `_removed_circle_posts` AS `rp` ON `rp`.`id` = `pi`.`post_id`;
DELETE `pm`
FROM `post_mentions` AS `pm`
INNER JOIN `_removed_circle_posts` AS `rp` ON `rp`.`id` = `pm`.`post_id`;
DELETE `l`
FROM `likes` AS `l`
INNER JOIN `_removed_circle_posts` AS `rp` ON `rp`.`public_id` = `l`.`post_id`;
DELETE `tp`
FROM `topics_posts` AS `tp`
INNER JOIN `_removed_circle_posts` AS `rp` ON `rp`.`id` = `tp`.`post_id`;
DELETE `pm`
FROM `post_media` AS `pm`
INNER JOIN `_removed_circle_posts` AS `rp` ON `rp`.`id` = `pm`.`post_id`;
DELETE `p`
FROM `posts` AS `p`
INNER JOIN `_removed_circle_posts` AS `rp` ON `rp`.`id` = `p`.`id`;
DROP TEMPORARY TABLE `_removed_circle_posts`;

-- Remove message groups, quests, Circle/Karma data, and webhook preview data.
DELETE FROM `notification_groups` WHERE `type` = 'MESSAGE';
DELETE FROM `user_action_logs` WHERE `type_enum` IN ('JOIN_CIRCLE', 'LEAVE_CIRCLE');

DROP TABLE `messages`;
DROP TABLE `member_message_groups`;
DROP TABLE `message_groups`;
DROP TABLE `user_quest_logs`;
DROP TABLE `daily_quests`;
DROP TABLE `circle_post_quality_logs`;
DROP TABLE `circle_exp_logs`;
DROP TABLE `circle_member_bans`;
DROP TABLE `circle_energy`;
DROP TABLE `hero_badges`;
DROP TABLE `circle_invitations`;
DROP TABLE `circle_join_requests`;
DROP TABLE `circles`;
DROP TABLE `karma_transactions`;
DROP TABLE `user_karma`;
DROP TABLE `webhook_preview_images`;

ALTER TABLE `posts`
  MODIFY `type` ENUM('POST', 'REPLY', 'REPOST', 'QUOTE') NOT NULL DEFAULT 'POST',
  MODIFY `visibility` ENUM('PUBLIC', 'FRIEND', 'PRIVATE') NOT NULL DEFAULT 'PUBLIC';
ALTER TABLE `user_action_logs`
  MODIFY `type_enum` ENUM('POST_CREATED', 'POST_DELETED', 'LIKE_CREATED', 'FLOW_FOLLOWER_CREATED', 'FOLLOW_FOLLOWING_CREATED', 'QUOTE_CREATED', 'QUOTE_DELETED', 'SHARE_CREATED', 'SHARE_DELETED', 'INVITE_SENT', 'INVITE_ACCEPTED', 'GENERATE_POST_BEAUTIFUL', 'GENERATE_CAPTION_MD', 'GENERATE_IMAGE') NOT NULL;
ALTER TABLE `limit_actions`
  MODIFY `type_enum` ENUM('POST_CREATED', 'POST_DELETED', 'LIKE_CREATED', 'FLOW_FOLLOWER_CREATED', 'FOLLOW_FOLLOWING_CREATED', 'QUOTE_CREATED', 'QUOTE_DELETED', 'SHARE_CREATED', 'SHARE_DELETED', 'INVITE_SENT', 'INVITE_ACCEPTED', 'GENERATE_POST_BEAUTIFUL', 'GENERATE_CAPTION_MD', 'GENERATE_IMAGE') NOT NULL;
ALTER TABLE `user_restrictions`
  MODIFY `type_enum` ENUM('POSTING', 'AI_GENERATION_CAPTION', 'AI_GENERATION_IMAGE') NOT NULL;
ALTER TABLE `notification_groups`
  MODIFY `type` ENUM('POST', 'LIKE', 'FOLLOW', 'QUOTE', 'SHARE', 'REPLY', 'MENTION', 'INVITATION', 'JOIN_REQUEST') NOT NULL;
