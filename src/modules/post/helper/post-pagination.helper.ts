import { redisKey } from "@/constants/resolve-key/redis-key";
import { PostMapper } from "@/modules/post/mapper/post.mapper";
import { followerService } from "@/modules/user/service/follower.service";
import { redisService } from "@/providers/redis.provider";
import { buildCursorPagination, buildPagination } from "@/shared/pagination/cursor-pagination";
import { Prisma } from "@prisma/client";
import { postRepository } from "../repository/post.repository";

export const postListCacheTtlSeconds = 60;

export function cacheSegment(value?: string | null) {
  return encodeURIComponent(value ?? "none");
}

export function buildPostListNamespace(params: {
  scope: string;
  after?: string;
  take: number;
  userId?: string | null;
  extra?: string;
}) {
  return redisKey.post.list(
    cacheSegment(params.scope),
    cacheSegment(params.after),
    params.take,
    cacheSegment(params.userId),
    cacheSegment(params.extra),
  );
}

export async function paginatePosts({
  after,
  take,
  where,
  userId,
}: {
  after?: string;
  take: number;
  where: Prisma.PostWhereInput;
  userId?: string | null;
}) {
  const { currentAfter, currentLimit } = buildPagination({ after, take });

  const posts = await postRepository.findAll({
    after: currentAfter ?? undefined,
    take: currentLimit + 1,
    where,
    props: {
      userId,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    },
  });

  const authorIds = [...new Set(posts.map((post) => post.userId))];
  const following = await followerService.getUserFollowingPostByAuth(userId ?? "", authorIds);
  const follower = await followerService.getUserFollowersByAuth(userId ?? "", authorIds);
  const followingSet = new Set(
    following.map((row) => row.followingId)
  );
  const followerSet = new Set(
    follower.map((row) => row.userId)
  );

  // Poll
  const mapPostIdToPollId = new Map<string, number>();
  const voteCountMap = new Map<number, any>()
  posts.forEach((post) => {
    if (post.isSurvey && post.poll?.id) {
      mapPostIdToPollId.set(post.publicId, post.poll.id);
    }
  });

  if (mapPostIdToPollId.size > 0) {
    const pollIds = Array.from(mapPostIdToPollId.values())
    const keys = pollIds.map(id => redisKey.poll.countVote(id))
    const voteCountAll = await redisService.mGet(keys);
    pollIds.forEach((pollId, index) => {
      if (voteCountAll[index] !== null) {
        voteCountMap.set(pollId, JSON.parse(voteCountAll[index]))
      }
    })
  }

  const data = posts.map((post) => ({
    ...post,
    isFollowingAuthor: followingSet.has(post.userId),
    isFollowedByAuthor: followerSet.has(post.userId),
    poll: post?.poll && mapPostIdToPollId.has(post.publicId) ? {
      ...post.poll,
      voteCount: voteCountMap.get(post?.poll.id) ?? post.poll?.voteCount ?? 0,
    } : null
  }));

  const rows = data.map((post) =>
    PostMapper.toFeedResponse(post, userId ?? undefined),
  );
  const paginationResult = buildCursorPagination({
    rows,
    take: currentLimit,
    getAfter: (item) => item.publicId,
  });

  return {
    posts: paginationResult.rows,
    pagination: paginationResult.pagination,
  };
}
