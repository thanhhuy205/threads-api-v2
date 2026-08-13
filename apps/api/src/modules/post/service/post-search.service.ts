import { PostMapper } from "@/modules/post/mapper/post.mapper";
import { Injectable } from '@nestjs/common';
import { PostRepository } from "../repository/post.repository";

@Injectable()
export class PostSearchService {
  constructor(
    private readonly postRepository: PostRepository,
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
