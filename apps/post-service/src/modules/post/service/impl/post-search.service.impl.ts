import { Inject, Injectable } from '@nestjs/common';
import { PostMapper } from '../../adapters/inbound/http/presenter/post.mapper';
import { POST_REPOSITORY, type PostRepository } from '../../application/ports/inbound/post.repository';
import type { PostSearchService } from '../../application/use-cases/post-search.service';

@Injectable()
export class PostSearchServiceImpl implements PostSearchService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: PostRepository,
  ) { }
  async search(query: {
    q: string;
    topics: string;
    limit: string;
    page: string;
  }): Promise<any[]> {
    return this.searchByContent({
      query: query.q,
      take: Number(query.limit) || 10,
    });
  }

  async count(userId: string) {
    return this.postRepository.countPostBydUserId(userId);
  }

  async findById(id: number): Promise<{ publicId: string } | null> {
    return this.postRepository.findById(id);
  }

  async searchByContent({
    query,
    after,
    take,
    userId,
  }: {
    query: string;
    after?: string;
    take: number;
    userId?: string;
  }) {
    const posts = await this.postRepository.searchByContent({
      q: query,
      after,
      take,
      userId,
    });

    return posts.map((post) => PostMapper.toFeedResponse(post, userId));
  }
}
