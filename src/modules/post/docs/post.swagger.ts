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
            visibility: {
                type: 'string',
                enum: ['PUBLIC', 'FRIEND', 'PRIVATE'],
                example: 'PUBLIC',
                description: 'FRIEND means mutual follow. Visibility read filtering is documented but not enforced yet.',
            },
            isDisinformation: {
                type: 'boolean',
                example: false,
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-05-01T00:00:00.000Z',
            },
        },
        required: ['publicId', 'content', 'userId', 'visibility', 'isDisinformation', 'createdAt'],
    },
    PostPagination: {
        type: 'object',
        properties: {
            take: {
                type: 'integer',
                example: 10,
            },
            after: {
                type: ['string', 'null'],
                example: 'ckvqsn1gq00003s4k9sp17mcz',
            },
            hasMore: {
                type: 'boolean',
                example: true,
            },
        },
        required: ['take', 'after', 'hasMore'],
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
            replyPermission: {
                type: 'string',
                enum: ['everyone', 'followers', 'following', 'mentioned'],
                example: 'everyone',
                description: 'Optional. Case-insensitive, server normalizes to uppercase.',
            },
            visibility: {
                type: 'string',
                enum: ['PUBLIC', 'FRIEND', 'PRIVATE'],
                example: 'PUBLIC',
                description: 'Optional. Case-insensitive. Defaults to PUBLIC. FRIEND means mutual follow, but read filtering is not enforced yet.',
            },
        },
        required: ['content'],
    },
    UpdatePostRequest: {
        type: 'object',
        properties: {
            content: {
                type: 'string',
                minLength: 1,
                maxLength: 5000,
                example: 'Updated post content',
            },
            visibility: {
                type: 'string',
                enum: ['PUBLIC', 'FRIEND', 'PRIVATE'],
                example: 'FRIEND',
                description: 'FRIEND means mutual follow. Visibility read filtering is not enforced yet.',
            },
        },
        minProperties: 1,
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
    LikeRequest: {
        type: 'object',
        properties: {
            isLiked: {
                type: 'boolean',
                example: true,
            },
        },
        required: ['isLiked'],
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
            type: {
                type: 'string',
                enum: ['post', 'user', 'circle'],
                example: 'post',
            },
        },
        required: ['reason', 'type'],
    },
    ReportSubmission: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                example: 'cm_report_123',
            },
            targetType: {
                type: 'string',
                enum: ['POST', 'USER', 'CIRCLE'],
                example: 'POST',
            },
            targetId: {
                type: 'string',
                example: 'post_abc123',
            },
            reason: {
                type: 'string',
                example: 'Spam content',
            },
            status: {
                type: 'string',
                enum: ['PENDING', 'RESOLVED', 'DISMISSED'],
                example: 'PENDING',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-05-01T00:00:00.000Z',
            },
            evaluationQueued: {
                type: 'boolean',
                example: true,
            },
        },
        required: ['id', 'targetType', 'targetId', 'reason', 'status', 'createdAt', 'evaluationQueued'],
    },
    ReportPostResponse: {
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
                properties: {
                    reported: {
                        type: 'boolean',
                        example: true,
                    },
                    report: {
                        $ref: '#/components/schemas/ReportSubmission',
                    },
                },
                required: ['reported', 'report'],
            },
        },
        required: ['success', 'message', 'data'],
    },
    SimilarPostsRequest: {
        type: 'object',
        properties: {
            content: {
                type: 'string',
                minLength: 1,
                example: 'A practical note about Prisma pagination',
            },
            topic: {
                type: 'array',
                items: { type: 'string', minLength: 1 },
                example: ['prisma', 'backend'],
            },
        },
        required: ['content', 'topic'],
    },
    SimilarPostItem: {
        type: 'object',
        properties: {
            userSnapshot: {
                type: 'object',
                additionalProperties: true,
            },
            content: { type: 'string', example: 'Related post content' },
            publicId: { type: 'string', example: 'post_related_123' },
            createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['userSnapshot', 'content', 'publicId', 'createdAt'],
    },
    SimilarPostsResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: POST_MESSAGE.RETRIEVED },
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/SimilarPostItem' },
            },
        },
        required: ['success', 'message', 'data'],
    },
};

const cursorPaginationQueryParameters = [
    {
        name: 'after',
        in: 'query',
        required: false,
        schema: {
            type: 'string',
            example: 'ckvqsn1gq00003s4k9sp17mcz',
        },
        description: 'Cursor publicId from previous response pagination.after',
    },
    {
        name: 'take',
        in: 'query',
        required: false,
        schema: {
            type: 'integer',
            example: 10,
        },
        description: 'Number of items to return',
    },
];

const newsFeedQueryParameters = [
    ...cursorPaginationQueryParameters,
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

const searchPaginationQueryParameters = [
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

const postSearchQueryParameters = [
    ...searchPaginationQueryParameters,
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
    ...cursorPaginationQueryParameters,
];

const reportTargetIdParameter = {
    name: 'publicId',
    in: 'path',
    required: true,
    schema: {
        type: 'string',
        example: 'post_abc123xyz789',
    },
    description: 'Target identifier. type=post/circle => post publicId, type=user => user id.',
};

const usernameParameters = [
    {
        name: 'username',
        in: 'path',
        required: true,
        schema: {
            type: 'string',
            example: 'alice',
        },
        description: 'Username',
    },
    ...cursorPaginationQueryParameters,
];

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const postSwaggerPaths = {
    '/posts/news-feed': {
        get: {
            tags: ['Post'],
            summary: 'Get news feed',
            security: [],
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
                400: {
                    description: COMMON_MESSAGE.VALIDATION_FAILED,
                },
            },
        },
    },
    '/posts/{publicId}/similar': {
        post: {
            tags: ['Post'],
            summary: 'Get semantically similar posts',
            parameters: [publicIdParameters[0]],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/SimilarPostsRequest',
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
                                $ref: '#/components/schemas/SimilarPostsResponse',
                            },
                        },
                    },
                },
                400: {
                    description: COMMON_MESSAGE.VALIDATION_FAILED,
                },
                404: {
                    description: 'Post not found',
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
                400: {
                    description: COMMON_MESSAGE.VALIDATION_FAILED,
                },
            },
        },
        patch: {
            tags: ['Post'],
            summary: 'Update post content or visibility by public id',
            security: bearerAuthSecurity,
            parameters: [publicIdParameters[0]],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/UpdatePostRequest',
                        },
                        example: {
                            content: 'Updated post content',
                            visibility: 'FRIEND',
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
                403: {
                    description: COMMON_MESSAGE.FORBIDDEN,
                },
                404: {
                    description: 'Post not found',
                },
            },
        },
        delete: {
            tags: ['Post'],
            summary: 'Soft delete post by public id',
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
                403: {
                    description: COMMON_MESSAGE.FORBIDDEN,
                },
                404: {
                    description: 'Post not found',
                },
            },
        },
    },
    '/posts/me': {
        get: {
            tags: ['Post'],
            summary: 'Get current user posts',
            security: bearerAuthSecurity,
            parameters: cursorPaginationQueryParameters,
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
                404: {
                    description: 'User not found',
                },
            },
        },
    },
    '/posts/me/replies': {
        get: {
            tags: ['Post'],
            summary: 'Get current user replies',
            security: bearerAuthSecurity,
            parameters: cursorPaginationQueryParameters,
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
                401: {
                    description: AUTH_MESSAGE.TOKEN_INVALID,
                },
                404: {
                    description: 'User not found',
                },
            },
        },
    },
    '/posts/me/quote': {
        get: {
            tags: ['Post'],
            summary: 'Get current user quotes and reposts',
            security: bearerAuthSecurity,
            parameters: cursorPaginationQueryParameters,
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
                404: {
                    description: 'User not found',
                },
            },
        },
    },
    '/posts/user/{username}': {
        get: {
            tags: ['Post'],
            summary: 'Get user posts',
            security: [],
            parameters: usernameParameters,
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
                404: {
                    description: 'Post not found',
                },
            },
        },
    },
    '/posts/user/{username}/replies': {
        get: {
            tags: ['Post'],
            summary: 'Get user replies',
            security: [],
            parameters: usernameParameters,
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
                404: {
                    description: 'Post not found',
                },
            },
        },
    },
    '/posts/user/{username}/quotes': {
        get: {
            tags: ['Post'],
            summary: 'Get user quotes and reposts',
            security: [],
            parameters: usernameParameters,
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
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/LikeRequest',
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
                404: {
                    description: 'Origin post not found',
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
                404: {
                    description: 'Post not found',
                },
            },
        },
    },
    '/posts/{publicId}/report': {
        post: {
            tags: ['Post'],
            summary: 'Report a target (post/user/circle post)',
            security: bearerAuthSecurity,
            parameters: [reportTargetIdParameter],
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
                                $ref: '#/components/schemas/ReportPostResponse',
                            },
                            example: {
                                success: true,
                                message: POST_MESSAGE.RETRIEVED,
                                data: {
                                    reported: true,
                                    report: {
                                        id: 'cm_report_123',
                                        targetType: 'POST',
                                        targetId: 'post_abc123',
                                        reason: 'Spam content',
                                        status: 'PENDING',
                                        createdAt: '2026-05-01T00:00:00.000Z',
                                        evaluationQueued: true,
                                    },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: AUTH_MESSAGE.TOKEN_INVALID,
                },
                404: {
                    description: 'Post not found',
                },
            },
        },
    },
};
