export const POST_SEARCH_SERVICE = Symbol('POST_SEARCH_SERVICE');
export interface PostSearchService {
  search(query: { q: string; topics: string; limit: string; page: string }): Promise<any[]>;
  count(userId: string): Promise<number>;
  findById(id: number): Promise<{ publicId: string } | null>;
  searchByContent(payload: { query: string; after?: string; take: number; userId?: string }): Promise<any[]>;
}
