export const postSwaggerSchemas = {
    PostRecord: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                example: 1,
            },
            content: {
                type: 'string',
                example: 'Hello Threads',
            },
            userId: {
                type: 'string',
                example: 'ckv8p4u1q0000x3jz8d2b6g7h',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-05-01T00:00:00.000Z',
            },
        },
        required: ['id', 'content', 'userId', 'createdAt'],
    },
    PostPagination: {
        type: 'object',
        properties: {
            currentPage: {
                type: 'integer',
                example: 1,
            },
            perPage: {
                type: 'integer',
                example: 20,
            },
            total: {
                type: 'integer',
                example: 42,
            },
            rowCount: {
                type: 'integer',
                example: 20,
            },
        },
        required: ['currentPage', 'perPage', 'total', 'rowCount'],
    },
    PaginatedPostResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            data: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/PostRecord',
                },
            },
            pagination: {
                $ref: '#/components/schemas/PostPagination',
            },
        },
        required: ['success', 'data', 'pagination'],
    },
    CreatePostRequest: {
        type: 'object',
        properties: {
            content: {
                type: 'string',
                example: 'Hello Threads',
            },
        },
        required: ['content'],
    },
    PostSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Post created',
            },
            data: {
                $ref: '#/components/schemas/PostRecord',
            },
        },
        required: ['success', 'message', 'data'],
    },
};

const postPaginationQueryParameters = [
    {
        name: 'page',
        in: 'query',
        required: false,
        schema: {
            type: 'integer',
            example: 1,
        },
        description: 'Page number',
    },
    {
        name: 'limit',
        in: 'query',
        required: false,
        schema: {
            type: 'integer',
            example: 20,
        },
        description: 'Items per page',
    },
];

const newsFeedQueryParameters = [
    ...postPaginationQueryParameters,
    {
        name: 'feedType',
        in: 'query',
        required: false,
        schema: {
            type: 'string',
            enum: ['for_you', 'following', 'me'],
            example: 'for_you',
        },
        description: 'News feed type',
    },
];

const postIdParameters = [
    {
        name: 'postId',
        in: 'path',
        required: true,
        schema: {
            type: 'integer',
            example: 1,
        },
        description: 'Parent post id',
    },
    ...postPaginationQueryParameters,
];

const userIdParameters = [
    {
        name: 'userId',
        in: 'path',
        required: true,
        schema: {
            type: 'string',
            example: 'ckv8p4u1q0000x3jz8d2b6g7h',
        },
        description: 'User id',
    },
    ...postPaginationQueryParameters,
];

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const postSwaggerPaths = {
    '/posts/news-feed': {
        get: {
            tags: ['Post'],
            summary: 'Get news feed',
            parameters: newsFeedQueryParameters,
            responses: {
                200: {
                    description: 'News feed retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PaginatedPostResponse',
                            },
                        },
                    },
                },
                401: {
                    description: 'Invalid token',
                },
            },
        },
    },
    '/posts/{postId}/replies': {
        get: {
            tags: ['Post'],
            summary: 'Get replies for a post',
            parameters: postIdParameters,
            responses: {
                200: {
                    description: 'Replies retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PaginatedPostResponse',
                            },
                        },
                    },
                },
            },
        },
    },
    '/posts/me': {
        get: {
            tags: ['Post'],
            summary: 'Get current user posts',
            security: bearerAuthSecurity,
            parameters: postPaginationQueryParameters,
            responses: {
                200: {
                    description: 'Posts retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PaginatedPostResponse',
                            },
                        },
                    },
                },
                401: {
                    description: 'Invalid token',
                },
            },
        },
    },
    '/posts/{userId}/repost': {
        get: {
            tags: ['Post'],
            summary: 'Get user reposts',
            security: bearerAuthSecurity,
            parameters: userIdParameters,
            responses: {
                200: {
                    description: 'Reposts retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PaginatedPostResponse',
                            },
                        },
                    },
                },
                401: {
                    description: 'Invalid token',
                },
            },
        },
    },
    '/posts/{userId}/quote': {
        get: {
            tags: ['Post'],
            summary: 'Get user quotes',
            security: bearerAuthSecurity,
            parameters: userIdParameters,
            responses: {
                200: {
                    description: 'Quotes retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PaginatedPostResponse',
                            },
                        },
                    },
                },
                401: {
                    description: 'Invalid token',
                },
            },
        },
    },
    '/posts': {
        post: {
            tags: ['Post'],
            summary: 'Create a post',
            security: bearerAuthSecurity,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/CreatePostRequest',
                        },
                        example: {
                            content: 'Hello Threads',
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Post created',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PostSuccessResponse',
                            },
                        },
                    },
                },
                400: {
                    description: 'Validation failed',
                },
                401: {
                    description: 'Invalid token',
                },
            },
        },
    },
};