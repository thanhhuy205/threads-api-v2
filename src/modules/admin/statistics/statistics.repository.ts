import prisma from "@/config/prisma";
import { Prisma, ReportStatus, UserStatus } from "@prisma/client";
import type { GetAdminStatsInput } from "./interfaces/get-admin-stats.input";

class StatisticsRepository {
  async getOverview(input: GetAdminStatsInput) {
    const [postsPerDay, activeUsers, totalUsers, totalPosts, pendingReports, topHashtags] =
      await Promise.all([
        this.countPostsPerDay(input),
        prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
        prisma.user.count(),
        prisma.post.count({ where: { isDeleted: false } }),
        prisma.report.count({ where: { status: ReportStatus.PENDING } }),
        prisma.topic.findMany({
          take: 10,
          orderBy: [
            { count: "desc" },
            { updatedAt: "desc" },
          ],
          select: {
            id: true,
            name: true,
            count: true,
          },
        }),
      ]);

    return {
      postsPerDay,
      activeUsers,
      totalUsers,
      totalPosts,
      pendingReports,
      topHashtags,
    };
  }

  private async countPostsPerDay(input: GetAdminStatsInput) {
    const conditions = [Prisma.sql`is_deleted = false`];

    if (input.startDate) {
      conditions.push(Prisma.sql`created_at >= ${input.startDate}`);
    }

    if (input.endDate) {
      conditions.push(Prisma.sql`created_at <= ${input.endDate}`);
    }

    const rows = await prisma.$queryRaw<Array<{ day: string; total: bigint | number }>>(
      Prisma.sql`
        SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day, COUNT(*) AS total
        FROM posts
        WHERE ${Prisma.join(conditions, " AND ")}
        GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
        ORDER BY day ASC
      `,
    );

    return rows.map((row) => ({
      day: row.day,
      total: Number(row.total),
    }));
  }
}

export const statisticsRepository = new StatisticsRepository();
