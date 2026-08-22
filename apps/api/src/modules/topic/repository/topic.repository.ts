export const TOPIC_REPOSITORY = Symbol('TOPIC_REPOSITORY');

export type TopicRecord = {
  name: string;
  count: number;
};

export interface TopicRepository {
  findAll(input: {
    after?: string;
    take?: number;
    where?: { q: string };
  }): Promise<TopicRecord[]>;
  searchByName(q: string, after?: string): Promise<TopicRecord[]>;
  listNames(topicNames: string[]): Promise<{ name: string }[]>;
  upsertByName(name: string): Promise<TopicRecord>;
  searchTopic(input: { q: string }): Promise<TopicRecord[]>;
}
