import prisma from "@/config/prisma";
import { postFeedSelect } from "@/modules/post/selector/post.selector";
import { elasticSearchClient } from "@/providers/elastic-search.provider";
import { buildCursorPagination } from "@/shared/pagination/cursor-pagination";

type SerpType = "default";

type SearchPostInput = {
  q: string;
  after?: string;
  take: number;
  serpType?: SerpType;
};

type SearchUserInput = {
  q: string;
  after?: string;
  take: number;
};

type SearchTopicInput = {
  q: string;
  after?: string;
  take: number;
};

type PostSearchDoc = {
  publicId?: string;
  postId?: number;
};

type UserSearchDoc = {
  username?: string;
};

type TopicSearchDoc = {
  topicName?: string;
};

class SearchService {
  private async searchIndex<TDoc>({
    q,
    type,
    fields,
    sortField,
    take,
    after,
  }: {
    q: string;
    type: "post" | "user" | "topic";
    fields: string[];
    sortField: "publicId" | "username" | "topicName";
    take: number;
    after?: string;
  }): Promise<TDoc[]> {
    const response = await elasticSearchClient.search({
      index: "search",
      body: {
        size: take + 1,
        query: {
          bool: {
            filter: [{ term: { type } }],
            must: [
              {
                multi_match: {
                  query: q,
                  fields,
                  fuzziness: "AUTO",
                },
              },
            ],
          },
        },
        sort: [{ [sortField]: "desc" }],
        search_after: after ? [after] : undefined,
      },
    });

    const hits = ((response as { body?: { hits?: { hits?: Array<{ _source?: TDoc }> } } })
      .body?.hits?.hits ?? []);

    return hits
      .map((hit) => hit._source)
      .filter((item): item is TDoc => Boolean(item));
  }

  private reorderByKeys<T>(items: T[], keys: string[], getKey: (item: T) => string) {
    const map = new Map(items.map((item) => [getKey(item), item]));
    return keys.map((key) => map.get(key)).filter((item): item is T => Boolean(item));
  }

  async searchPost({ q, after, take, serpType = "default" }: SearchPostInput) {
    if (serpType !== "default") {
      serpType = "default";
    }

    const docs = await this.searchIndex<PostSearchDoc>({
      q,
      type: "post",
      fields: ["content^3", "authorUsername^2"],
      sortField: "publicId",
      after,
      take,
    });

    const publicIds = docs
      .map((item) => item.publicId?.trim())
      .filter((item): item is string => Boolean(item));

    if (!publicIds.length) {
      return buildCursorPagination({
        rows: [],
        take,
        getAfter: (item) => item.publicId,
      });
    }

    const posts = await prisma.post.findMany({
      where: {
        publicId: {
          in: publicIds,
        },
        isDeleted: false,
      },
      select: postFeedSelect,
    });

    const rows = this.reorderByKeys(posts, publicIds, (item) => item.publicId);

    return buildCursorPagination({
      rows,
      take,
      getAfter: (item) => item.publicId,
    });
  }

  async searchUsername({ q, after, take }: SearchUserInput) {
    const docs = await this.searchIndex<UserSearchDoc>({
      q,
      type: "user",
      fields: ["username^3", "name^2", "bio"],
      sortField: "username",
      after,
      take,
    });

    const usernames = docs
      .map((item) => item.username?.trim())
      .filter((item): item is string => Boolean(item));

    if (!usernames.length) {
      return buildCursorPagination({
        rows: [],
        take,
        getAfter: (item) => item.username,
      });
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          in: usernames,
        },
      },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatar: true,
        verifiedAt: true,
        followersCount: true,
        followingCount: true,
        postsCount: true,
        isPrivate: true,
        location: true,
        website: true,
      },
    });

    const rows = this.reorderByKeys(users, usernames, (item) => item.username);

    return buildCursorPagination({
      rows,
      take,
      getAfter: (item) => item.username,
    });
  }

  async searchTopic({ q, after, take }: SearchTopicInput) {
    const docs = await this.searchIndex<TopicSearchDoc>({
      q,
      type: "topic",
      fields: ["topicName^3"],
      sortField: "topicName",
      after,
      take,
    });

    const topicNames = docs
      .map((item) => item.topicName?.trim())
      .filter((item): item is string => Boolean(item));

    if (!topicNames.length) {
      return buildCursorPagination({
        rows: [],
        take,
        getAfter: (item) => item.name,
      });
    }

    const topics = await prisma.topic.findMany({
      where: {
        name: {
          in: topicNames,
        },
      },
      select: {
        name: true,
        count: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const rows = this.reorderByKeys(topics, topicNames, (item) => item.name);

    return buildCursorPagination({
      rows,
      take,
      getAfter: (item) => item.name,
    });
  }
}

export const searchService = new SearchService();
