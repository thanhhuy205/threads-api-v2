export const TOPIC_SERVICE = Symbol('TOPIC_SERVICE');

export interface TopicService {
  searchByName(query: string): Promise<any[]>;
  listNames(topicNames: string[]): Promise<any[]>;
  createOrIncrement(name: string): Promise<any>;
}
