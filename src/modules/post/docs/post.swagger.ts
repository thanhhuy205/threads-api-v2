import { AUTH_MESSAGE, COMMON_MESSAGE, POST_MESSAGE } from '@/constants/message';

export const postSwaggerSchemas = {
    PostRecord: {
        type: 'object',
        properties: {
            publicId: {
                type: 'string',
                example: 'post_abc123xyz789',
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
        required: ['publicId', 'content', 'userId', 'createdAt'],
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
                example: POST_MESSAGE.CREATED,
            },
            data: {
                $ref: '#/components/schemas/PostRecord',
            },
        },
        required: ['success', 'message', 'data'],
    },
    PostSearchResponse: {
        type: 'object',
        properties: {
            q: {
                type: 'string',
                example: 'prisma',
            },
            topics: {
                type: 'string',
                example: 'DDD,ExpressJS',
            },
            limit: {
                type: 'string',
                example: '10',
            },
            page: {
                type: 'string',
                example: '1',
            },
        },
        required: ['q', 'topics', 'limit', 'page'],
    },
    PostSearchSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: POST_MESSAGE.SEARCH_SUCCESS,
            },
            data: {
                $ref: '#/components/schemas/PostSearchResponse',
            },
        },
        required: ['success', 'message', 'data'],
    },
    PostActionFlagResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: POST_MESSAGE.RETRIEVED,
            },
            data: {
                type: 'object',
                additionalProperties: {
                    type: 'boolean',
                },
                example: {
                    liked: true,
                },
            },
        },
        required: ['success', 'message', 'data'],
    },
    ReportPostRequest: {
        type: 'object',
        properties: {
            reason: {
                type: 'string',
                minLength: 1,
                maxLength: 1000,
                example: 'Spam content',
            },
        },
        required: ['reason'],
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
        name: 'type',
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

const postSearchQueryParameters = [
    ...postPaginationQueryParameters,
    {
        name: 'q',
        in: 'query',
        required: false,
        schema: {
            type: 'string',
            example: 'prisma',
        },
        description: 'Search keyword',
    },
    {
        name: 'topics',
        in: 'query',
        required: false,
        schema: {
            type: 'string',
            example: 'DDD,ExpressJS',
        },
        description: 'Comma-separated topics',
    },
];

const publicIdParameters = [
    {
        name: 'publicId',
        in: 'path',
        required: true,
        schema: {
            type: 'string',
            example: 'post_abc123xyz789',
        },
        description: 'Post public id',
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
                    description: POST_MESSAGE.NEWS_FEED_RETRIEVED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PaginatedPostResponse',
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
    '/posts/search': {
        get: {
            tags: ['Post'],
            summary: 'Search posts',
            parameters: postSearchQueryParameters,
            responses: {
                200: {
                    description: POST_MESSAGE.SEARCH_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PostSearchSuccessResponse',
                            },
                        },
                    },
                },
            },
        },
    },
    '/posts/{publicId}/replies': {
        get: {
            tags: ['Post'],
            summary: 'Get replies for a post',
            parameters: publicIdParameters,
            responses: {
                200: {
                    description: POST_MESSAGE.REPLIES_RETRIEVED,
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
    '/posts/{publicId}': {
        get: {
            tags: ['Post'],
            summary: 'Get post by public id',
            parameters: [publicIdParameters[0]],
            responses: {
                200: {
                    description: POST_MESSAGE.RETRIEVED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PostSuccessResponse',
                            },
                        },
                    },
                },
                404: { description: 'Post not found' },
            },
        },
        delete: {
            tags: ['Post'],
            summary: 'Delete post by public id',
            security: bearerAuthSecurity,
            parameters: [publicIdParameters[0]],
            responses: {
                200: {
                    description: POST_MESSAGE.RETRIEVED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PostActionFlagResponse',
                            },
                            example: {
                                success: true,
                                message: POST_MESSAGE.RETRIEVED,
                                data: {
                                    deleted: true,
                                },
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
    '/posts/me': {
        get: {
            tags: ['Post'],
            summary: 'Get current user posts',
            security: bearerAuthSecurity,
            parameters: postPaginationQueryParameters,
            responses: {
                200: {
                    description: POST_MESSAGE.RETRIEVED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PaginatedPostResponse',
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
    '/posts/{userId}/repost': {
        get: {
            tags: ['Post'],
            summary: 'Get user reposts',
            security: bearerAuthSecurity,
            parameters: userIdParameters,
            responses: {
                200: {
                    description: POST_MESSAGE.REPOSTS_RETRIEVED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PaginatedPostResponse',
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
    '/posts/{userId}/quote': {
        get: {
            tags: ['Post'],
            summary: 'Get user quotes',
            security: bearerAuthSecurity,
            parameters: userIdParameters,
            responses: {
                200: {
                    description: POST_MESSAGE.QUOTES_RETRIEVED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PaginatedPostResponse',
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
                    description: POST_MESSAGE.CREATED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PostSuccessResponse',
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
    '/posts/{publicId}/reply': {
        post: {
            tags: ['Post'],
            summary: 'Reply to a post',
            security: bearerAuthSecurity,
            parameters: [publicIdParameters[0]],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/CreatePostRequest',
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: POST_MESSAGE.CREATED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PostSuccessResponse',
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
    '/posts/{publicId}/like': {
        post: {
            tags: ['Post'],
            summary: 'Like a post',
            security: bearerAuthSecurity,
            parameters: [publicIdParameters[0]],
            responses: {
                200: {
                    description: POST_MESSAGE.RETRIEVED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PostActionFlagResponse',
                            },
                            example: {
                                success: true,
                                message: POST_MESSAGE.RETRIEVED,
                                data: {
                                    liked: true,
                                },
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
    '/posts/{publicId}/repost': {
        post: {
            tags: ['Post'],
            summary: 'Repost a post',
            security: bearerAuthSecurity,
            parameters: [publicIdParameters[0]],
            responses: {
                201: {
                    description: POST_MESSAGE.CREATED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PostSuccessResponse',
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
    '/posts/{publicId}/quote': {
        post: {
            tags: ['Post'],
            summary: 'Quote a post',
            security: bearerAuthSecurity,
            parameters: [publicIdParameters[0]],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/CreatePostRequest',
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: POST_MESSAGE.CREATED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PostSuccessResponse',
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
    '/posts/{publicId}/save': {
        post: {
            tags: ['Post'],
            summary: 'Save a post',
            security: bearerAuthSecurity,
            parameters: [publicIdParameters[0]],
            responses: {
                200: {
                    description: POST_MESSAGE.RETRIEVED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PostActionFlagResponse',
                            },
                            example: {
                                success: true,
                                message: POST_MESSAGE.RETRIEVED,
                                data: {
                                    saved: true,
                                },
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
    '/posts/{publicId}/hide': {
        post: {
            tags: ['Post'],
            summary: 'Hide a post',
            security: bearerAuthSecurity,
            parameters: [publicIdParameters[0]],
            responses: {
                200: {
                    description: POST_MESSAGE.RETRIEVED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PostActionFlagResponse',
                            },
                            example: {
                                success: true,
                                message: POST_MESSAGE.RETRIEVED,
                                data: {
                                    hidden: true,
                                },
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
    '/posts/{publicId}/report': {
        post: {
            tags: ['Post'],
            summary: 'Report a post',
            security: bearerAuthSecurity,
            parameters: [publicIdParameters[0]],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ReportPostRequest',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: POST_MESSAGE.RETRIEVED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PostActionFlagResponse',
                            },
                            example: {
                                success: true,
                                message: POST_MESSAGE.RETRIEVED,
                                data: {
                                    reported: true,
                                },
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