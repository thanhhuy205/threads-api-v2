import { topicRepository } from "../repository/topic.repository";

class TopicService {
  private normalizeTopicName(name: string): string {
    return name.trim().replace(/\s+/g, " ").toLowerCase();
  }

  async findByName(name: string) {
    return topicRepository.findByName(this.normalizeTopicName(name));
  }
}

export const topicService = new TopicService();
