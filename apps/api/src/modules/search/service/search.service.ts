export const SEARCH_SERVICE = Symbol('SEARCH_SERVICE');

export type SerpType = 'default';
export type SearchPostInput = {
  q: string;
  after?: string;
  take: number;
  serpType?: SerpType;
  userId?: string;
};

export interface SearchService {
  searchPost(input: SearchPostInput): Promise<any>;
  searchTopic(input: { q: string }): Promise<any>;
}
