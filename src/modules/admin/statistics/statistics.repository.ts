class StatisticsRepository {
  async getOverview() {
    return {
      postsPerDay: [],
      activeUsers: 0,
      topHashtags: [],
    };
  }
}

export const statisticsRepository = new StatisticsRepository();
