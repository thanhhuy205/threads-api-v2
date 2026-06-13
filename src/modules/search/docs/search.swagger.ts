import { AUTH_MESSAGE, COMMON_MESSAGE } from "@/constants/message";

const bearerAuthSecurity = [{ bearerAuth: [] }];

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
};

export const searchSwaggerPaths = {
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
};
