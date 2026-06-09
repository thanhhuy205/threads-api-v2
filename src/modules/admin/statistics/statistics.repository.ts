import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import type { GetAdminStatsInput } from "./interfaces/get-admin-stats.input";

type CountRow = {
  total: bigint | number;
};

type HotTopicRow = {
  id: number;
  name: string;
  usage_count: bigint | number;
};

class StatisticsRepository {
  async getOverview(input: GetAdminStatsInput) {
    const [postsPerDay, activeUsers, hotTopic] = await Promise.all([
      this.countPostsPerDay(input),
      this.countActiveUsers(input),
      this.findHotTopic(input),
    ]);

    return {
      postsPerDay,
      activeUsers,
      hotTopic,
    };
  }

  private async countPostsPerDay(input: GetAdminStatsInput) {
    const rows = await prisma.$queryRaw<Array<{ day: string; total: bigint | number }>>(
      Prisma.sql`
        SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day, COUNT(*) AS total
        FROM posts
        WHERE is_deleted = false
          AND created_at >= ${input.startAt}
          AND created_at < ${input.endAt}
        GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
        ORDER BY day ASC
      `,
    );

    return rows.map((row) => ({
      day: row.day,
      total: Number(row.total),
    }));
  }

  private async countActiveUsers(input: GetAdminStatsInput) {
    const rows = await prisma.$queryRaw<CountRow[]>(
      Prisma.sql`
        SELECT COUNT(DISTINCT activity.user_id) AS total
        FROM (
          SELECT user_id
          FROM user_action_logs
          WHERE created_at >= ${input.startAt}
            AND created_at < ${input.endAt}

          UNION

          SELECT user_id
          FROM posts
          WHERE is_deleted = false
            AND created_at >= ${input.startAt}
            AND created_at < ${input.endAt}
        ) AS activity
      `,
    );

    return Number(rows[0]?.total ?? 0);
  }

  private async findHotTopic(input: GetAdminStatsInput) {
    const rows = await prisma.$queryRaw<HotTopicRow[]>(
      Prisma.sql`
        SELECT topics.id, topics.name, COUNT(*) AS usage_count
        FROM topics
        INNER JOIN topics_posts ON topics_posts.topic_id = topics.id
        INNER JOIN posts ON posts.id = topics_posts.post_id
        WHERE posts.is_deleted = false
          AND posts.created_at >= ${input.startAt}
          AND posts.created_at < ${input.endAt}
        GROUP BY topics.id, topics.name
        ORDER BY usage_count DESC, topics.id ASC
        LIMIT 1
      `,
    );

    const hotTopic = rows[0];
    if (!hotTopic) {
      return null;
    }

    return {
      id: hotTopic.id,
      name: hotTopic.name,
      count: Number(hotTopic.usage_count),
    };
  }
}

export const statisticsRepository = new StatisticsRepository();
