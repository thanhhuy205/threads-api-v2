import { PostMapper } from "@/modules/post/mapper/post.mapper";
import { followerService } from "@/modules/user/service/follower.service";
import { postRepository } from "../repository/post.repository";

class PostSearchService {
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
    return postRepository.countPostBydUserId(userId);
  }

  async findById(id: number): Promise<{ publicId: string } | null> {
    return postRepository.findById(id);
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
    const posts = await postRepository.searchByContent({
      q: query,
      after,
      take,
      userId,
    });

    const authorIds = [...new Set(posts.map((post) => post.userId))];
    const following = await followerService.getUserFollowingPostByAuth(
      userId ?? "",
      authorIds,
    );
    const followers = await followerService.getUserFollowersByAuth(
      userId ?? "",
      authorIds,
    );
    const followingSet = new Set(following.map((row) => row.followingId));
    const followerSet = new Set(followers.map((row) => row.userId));

    return posts.map((post) =>
      PostMapper.toFeedResponse(
        {
          ...post,
          isFollowingAuthor: followingSet.has(post.userId),
          isFollowedByAuthor: followerSet.has(post.userId),
        },
        userId,
      ),
    );
  }
}

export const postSearchService = new PostSearchService();
