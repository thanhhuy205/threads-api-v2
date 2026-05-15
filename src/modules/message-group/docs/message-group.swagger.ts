import { AUTH_MESSAGE } from "@/constants/message";

const bearerAuthSecurity = [{ bearerAuth: [] }];

const paginationQueryParameters = [
  {
    name: "after",
    in: "query",
    required: false,
    schema: {
      type: "string",
      example: "cmx8j6h0w0000f4tkq4m2a1bz",
    },
    description: "Cursor from previous response pagination.after",
  },
  {
    name: "take",
    in: "query",
    required: false,
    schema: {
      type: "integer",
      example: 10,
    },
    description: "Number of items to return",
  },
];

const publicIdPathParameter = [
  {
    name: "publicId",
    in: "path",
    required: true,
    schema: {
      type: "string",
      example: "cmx8j6h0w0000f4tkq4m2a1bz",
    },
    description: "Message group public id",
  },
];

export const messageGroupSwaggerSchemas = {
  MessageGroupPagination: {
    type: "object",
    properties: {
      take: { type: "integer", example: 10 },
      after: { type: ["string", "null"], example: "cmx8j6h0w0000f4tkq4m2a1bz" },
      hasMore: { type: "boolean", example: true },
    },
    required: ["take", "after", "hasMore"],
  },
  MessageGroupCreateRequest: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["private", "crowd"],
        example: "private",
      },
      members: {
        type: "array",
        items: {
          type: "string",
          example: "john_doe",
        },
      },
    },
    required: ["type", "members"],
  },
  MessageCreateRequest: {
    type: "object",
    properties: {
      content: {
        type: "string",
        example: "Hello everyone",
      },
    },
    required: ["content"],
  },
  MessageGroupMemberUser: {
    type: "object",
    properties: {
      id: { type: "string" },
      username: { type: "string" },
      name: { type: "string", nullable: true },
      avatar: { type: "string", nullable: true },
    },
    required: ["id", "username"],
  },
  MessageGroupMember: {
    type: "object",
    properties: {
      id: { type: "string" },
      userId: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      user: { $ref: "#/components/schemas/MessageGroupMemberUser" },
    },
    required: ["id", "userId", "createdAt", "user"],
  },
  MessageGroupItem: {
    type: "object",
    properties: {
      id: { type: "string" },
      publicId: { type: "string" },
      name: { type: "string" },
      groupType: { type: "string", enum: ["PRIVATE", "CROWD"] },
      createdById: { type: "string" },
      lastMessageAt: { type: "string", format: "date-time" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
      members: {
        type: "array",
        items: { $ref: "#/components/schemas/MessageGroupMember" },
      },
    },
    required: [
      "id",
      "publicId",
      "name",
      "groupType",
      "createdById",
      "lastMessageAt",
      "createdAt",
      "updatedAt",
      "members",
    ],
  },
  MessageItem: {
    type: "object",
    properties: {
      id: { type: "integer" },
      publicId: { type: "string" },
      messageGroupId: { type: "string" },
      senderId: { type: "string" },
      content: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
      sender: { $ref: "#/components/schemas/MessageGroupMemberUser" },
    },
    required: [
      "id",
      "publicId",
      "messageGroupId",
      "senderId",
      "content",
      "createdAt",
      "updatedAt",
      "sender",
    ],
  },
  MessageGroupSuccessResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Message group created successfully" },
      data: { $ref: "#/components/schemas/MessageGroupItem" },
    },
    required: ["success", "message", "data"],
  },
  MessageSuccessResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Message sent successfully" },
      data: { $ref: "#/components/schemas/MessageItem" },
    },
    required: ["success", "message", "data"],
  },
  MessageGroupPaginatedResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/MessageGroupItem" },
      },
      pagination: { $ref: "#/components/schemas/MessageGroupPagination" },
    },
    required: ["success", "data", "pagination"],
  },
  MessagePaginatedResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/MessageItem" },
      },
      pagination: { $ref: "#/components/schemas/MessageGroupPagination" },
    },
    required: ["success", "data", "pagination"],
  },
  MessageGroupMemberPaginatedResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/MessageGroupMember" },
      },
      pagination: { $ref: "#/components/schemas/MessageGroupPagination" },
    },
    required: ["success", "data", "pagination"],
  },
};

export const messageGroupSwaggerPaths = {
  "/message-group": {
    post: {
      tags: ["MessageGroup"],
      summary: "Create message group",
      security: bearerAuthSecurity,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/MessageGroupCreateRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Message group created successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessageGroupSuccessResponse" },
            },
          },
        },
        401: {
          description: AUTH_MESSAGE.TOKEN_INVALID,
        },
      },
    },
    get: {
      tags: ["MessageGroup"],
      summary: "Get current user message groups",
      security: bearerAuthSecurity,
      parameters: paginationQueryParameters,
      responses: {
        200: {
          description: "Message groups fetched successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessageGroupPaginatedResponse" },
            },
          },
        },
        401: {
          description: AUTH_MESSAGE.TOKEN_INVALID,
        },
      },
    },
  },
  "/message-group/{publicId}/messages": {
    post: {
      tags: ["MessageGroup"],
      summary: "Send message to group",
      security: bearerAuthSecurity,
      parameters: publicIdPathParameter,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/MessageCreateRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Message sent successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessageSuccessResponse" },
            },
          },
        },
        401: {
          description: AUTH_MESSAGE.TOKEN_INVALID,
        },
      },
    },
    get: {
      tags: ["MessageGroup"],
      summary: "Get messages by group",
      security: bearerAuthSecurity,
      parameters: [...publicIdPathParameter, ...paginationQueryParameters],
      responses: {
        200: {
          description: "Messages fetched successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessagePaginatedResponse" },
            },
          },
        },
        401: {
          description: AUTH_MESSAGE.TOKEN_INVALID,
        },
      },
    },
  },
  "/message-group/{publicId}/members": {
    get: {
      tags: ["MessageGroup"],
      summary: "Get group members",
      security: bearerAuthSecurity,
      parameters: [...publicIdPathParameter, ...paginationQueryParameters],
      responses: {
        200: {
          description: "Message group members fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageGroupMemberPaginatedResponse",
              },
            },
          },
        },
        401: {
          description: AUTH_MESSAGE.TOKEN_INVALID,
        },
      },
    },
  },
};

