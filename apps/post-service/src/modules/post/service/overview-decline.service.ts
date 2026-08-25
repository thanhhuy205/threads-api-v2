export const OVERVIEW_DECLINE_SERVICE = Symbol('OVERVIEW_DECLINE_SERVICE');
export interface OverviewDeclineService {
  findOneByPostId(postId: number): Promise<any>;
}
