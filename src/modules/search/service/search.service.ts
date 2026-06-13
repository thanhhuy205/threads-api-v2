import prisma from "@/config/prisma";
import { postFeedSelect } from "@/modules/post/selector/post.selector";
import { topicService } from "@/modules/topic/service/topic.service";
import { elasticSearchClient } from "@/providers/elastic-search.provider";
import { buildCursorPagination } from "@/shared/pagination/cursor-pagination";
import { userService } from '../../user/service/user.service';

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
    sortField: "publicId" | "username.keyword" | "topicName.keyword";
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
        getAfter: (item) => ""
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

    const rows = this.reorderByKeys(posts, publicIds, (item) => item?.publicId);

    return buildCursorPagination({
      rows,
      take,
      getAfter: (item) => item?.publicId,
    });
  }

  private async searchUsernameIndex({
    q,
    take,
    after,
  }: {
    q: string;
    take: number;
    after?: string;
  }) {
    const keyword = q.trim().toLowerCase();

    if (!keyword) return [];

    const response = await elasticSearchClient.search({
      index: "search",
      body: {
        size: take + 1,
        query: {
          bool: {
            filter: [
              { term: { type: "user" } },
            ],
            should: [
              {
                term: {
                  "username.keyword": {
                    value: keyword,
                    boost: 100,
                  },
                },
              },
              {
                match: {
                  "username.prefix": {
                    query: keyword,
                    boost: 50,
                  },
                },
              },
              {
                match: {
                  name: {
                    query: keyword,
                    boost: 5,
                  },
                },
              },
            ],
            minimum_should_match: 1,
          },
        },
        sort: [
          { _score: "desc" },
          { "username.keyword": "asc" },
        ],
        search_after: after ? JSON.parse(after) : undefined,
      },
    });

    const hits =
      (response as {
        body?: {
          hits?: {
            hits?: Array<{
              _source?: UserSearchDoc;
              sort?: unknown[];
            }>;
          };
        };
      }).body?.hits?.hits ?? [];

    return hits
      .filter((hit): hit is { _source: UserSearchDoc; sort: unknown[] } =>
        Boolean(hit._source && hit.sort),
      )
      .map((hit) => ({
        source: hit._source,
        sort: hit.sort,
      }));
  }


  private async searchTopicIndex({
    q,
    take,
    after,
  }: {
    q: string;
    take: number;
    after?: string;
  }) {
    const keyword = q.trim().toLowerCase();

    if (!keyword) return [];

    const response = await elasticSearchClient.search({
      index: "search",
      body: {
        size: take + 1,
        query: {
          bool: {
            filter: [
              { term: { type: "topic" } },
            ],
            should: [
              {
                term: {
                  "topicName.keyword": {
                    value: keyword,
                    boost: 100,
                  },
                },
              },
              {
                match: {
                  "topicName.prefix": {
                    query: keyword,
                    boost: 50,
                  },
                },
              },
              {
                match: {
                  name: {
                    query: keyword,
                    boost: 5,
                  },
                },
              },
            ],
            minimum_should_match: 1,
          },
        },
        sort: [
          { _score: "desc" },
          { "topicName.keyword": "asc" },
        ],
        search_after: after ? JSON.parse(after) : undefined,
      },
    });

    const hits =
      (response as {
        body?: {
          hits?: {
            hits?: Array<{
              _source?: TopicSearchDoc;
              sort?: unknown[];
            }>;
          };
        };
      }).body?.hits?.hits ?? [];

    return hits
      .filter((hit): hit is { _source: TopicSearchDoc; sort: unknown[] } =>
        Boolean(hit._source && hit.sort),
      )
      .map((hit) => ({
        source: hit._source,
        sort: hit.sort,
      }));
  }

  // async searchUsername({ q, after, take }: SearchUserInput) {
  //   const docs = await this.searchUsernameIndex({ q, after, take });

  //   const usernames = docs
  //     .map((item) => item.source.username?.trim())
  //     .filter((item): item is string => Boolean(item));

  //   if (!usernames.length) {
  //     return buildCursorPagination({
  //       rows: [],
  //       take,
  //       getAfter: (item) => "",
  //     });
  //   }

  //   const users = await userService.findUsersByUsernames(usernames);
  //   const rows = this.reorderByKeys(users, usernames, (item) => item.username);

  //   return buildCursorPagination({
  //     rows,
  //     take,
  //     getAfter: (item) => item.username,
  //   });
  // }

  // async searchUsername({ q, after, take }: SearchUserInput) {
  //   const result = await userService.searchUsername(q, after, take);

  //   return buildCursorPagination({
  //     rows: result.rows,
  //     take,
  //     getAfter: (item) => item.username,
  //   });
  // }
  async searchTopic({ q, after, take }: SearchTopicInput) {
    const docs = await this.searchTopicIndex({ q, after, take });

    const topicNames = docs
      .map((item) => item.source.topicName?.trim())
      .filter((item): item is string => Boolean(item));

    if (!topicNames.length) {
      return buildCursorPagination({
        rows: [],
        take,
        getAfter: (item) => "",
      });
    }

    const topics = await topicService.listNames(topicNames);

    const rows = this.reorderByKeys(topics, topicNames, (item) => item.name);

    return buildCursorPagination({
      rows,
      take,
      getAfter: (item) => item.name,
    });
  }
}

export const searchService = new SearchService();
