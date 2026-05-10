-- Add unique topic constraint per post
CREATE UNIQUE INDEX `uq_topics_posts_post_id` ON `topics_posts`(`post_id`);
