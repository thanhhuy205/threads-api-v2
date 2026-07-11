import { AUTH_MESSAGE, COMMON_MESSAGE } from "@/constants/message";

const bearerAuthSecurity = [{ bearerAuth: [] }];

const searchQueryParameter = {
  name: "q",
  in: "query",
  required: true,
  description: "Search text.",
  schema: {
    type: "string",
    minLength: 1,
    example: "threads",
  },
};

export const searchSwaggerSchemas = {
  SearchUsernameItem: {
    type: "object",
    properties: {
      id: {
        type: "string",
        example: "ckv8p4u1q0000x3jz8d2b6g7h",
      },
      username: {
        type: "string",
        example: "john_doe",
      },
      name: {
        type: "string",
        nullable: true,
        example: "John Doe",
      },
      avatar: {
        type: "string",
        format: "uri",
        nullable: true,
        example: "https://example.com/avatar.jpg",
      },
      verifiedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
        example: "2026-05-01T00:00:00.000Z",
      },
    },
    required: ["id", "username", "name", "avatar", "verifiedAt"],
  },
  SearchUsernameResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "Usernames retrieved successfully",
      },
      data: {
        type: "array",
        maxItems: 40,
        items: {
          $ref: "#/components/schemas/SearchUsernameItem",
        },
      },
    },
    required: ["success", "message", "data"],
  },
  SearchTopicResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "Topics retrieved successfully",
      },
      data: {
        type: "array",
        maxItems: 20,
        items: {
          $ref: "#/components/schemas/TopicItem",
        },
      },
    },
    required: ["success", "message", "data"],
  },
};

export const searchSwaggerPaths = {
  "/search/posts": {
    get: {
      tags: ["Search"],
      summary: "Search posts",
      description:
        "Searches visible posts by content using MySQL full-text search.",
      security: bearerAuthSecurity,
      parameters: [
        {
          ...searchQueryParameter,
          description: "Post content search text.",
          schema: {
            ...searchQueryParameter.schema,
            example: "prisma",
          },
        },
        {
          name: "after",
          in: "query",
          required: false,
          description: "Cursor returned by the previous response.",
          schema: {
            type: "string",
            minLength: 1,
            example: "post_abc123xyz789",
          },
        },
        {
          name: "take",
          in: "query",
          required: false,
          description: "Maximum number of posts to return.",
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            default: 20,
            example: 20,
          },
        },
        {
          name: "serp_type",
          in: "query",
          required: false,
          description: "Search result mode.",
          schema: {
            type: "string",
            enum: ["default"],
            default: "default",
          },
        },
      ],
      responses: {
        200: {
          description: "Posts retrieved successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PaginatedPostResponse",
              },
            },
          },
        },
        400: {
          description: COMMON_MESSAGE.VALIDATION_FAILED,
        },
        401: {
          description: AUTH_MESSAGE.TOKEN_INVALID,
        },
      },
    },
  },
  "/search/username": {
    get: {
      tags: ["Search"],
      summary: "Search usernames",
      description:
        "Returns up to 40 users ordered by descending n-gram full-text relevance.",
      security: bearerAuthSecurity,
      parameters: [
        {
          name: "q",
          in: "query",
          required: true,
          description: "Username search text.",
          schema: {
            type: "string",
            minLength: 1,
            example: "john",
          },
        },
      ],
      responses: {
        200: {
          description: "Usernames retrieved successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SearchUsernameResponse",
              },
            },
          },
        },
        400: {
          description: COMMON_MESSAGE.VALIDATION_FAILED,
        },
        401: {
          description: AUTH_MESSAGE.TOKEN_INVALID,
        },
      },
    },
  },
  "/search/topic": {
    get: {
      tags: ["Search"],
      summary: "Search topics",
      description:
        "Returns up to 20 topics matched by MySQL n-gram full-text search.",
      security: bearerAuthSecurity,
      parameters: [
        {
          ...searchQueryParameter,
          description: "Topic name search text.",
          schema: {
            ...searchQueryParameter.schema,
            example: "nestjs",
          },
        },
      ],
      responses: {
        200: {
          description: "Topics retrieved successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SearchTopicResponse",
              },
            },
          },
        },
        400: {
          description: COMMON_MESSAGE.VALIDATION_FAILED,
        },
        401: {
          description: AUTH_MESSAGE.TOKEN_INVALID,
        },
      },
    },
  },
};
