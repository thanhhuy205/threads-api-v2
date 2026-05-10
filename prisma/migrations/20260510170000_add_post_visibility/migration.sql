-- Add post-level visibility. Access filtering for FRIEND/PRIVATE is documented
-- and intentionally deferred from this migration slice.
ALTER TABLE `posts`
  ADD COLUMN `visibility` ENUM('PUBLIC', 'FRIEND', 'PRIVATE') NOT NULL DEFAULT 'PUBLIC';
