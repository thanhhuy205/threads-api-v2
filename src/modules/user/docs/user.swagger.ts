import { AUTH_MESSAGE, USER_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const userSwaggerSchemas = {
    UserFollowerItem: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                example: 'ckv8p4u1q0000x3jz8d2b6g7h',
            },
            username: {
                type: 'string',
                example: 'john_doe',
            },
            name: {
                type: 'string',
                nullable: true,
                example: 'John Doe',
            },
            verifiedAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                example: '2026-05-01T00:00:00.000Z',
            },
        },
        required: ['id', 'username'],
    },
    UserFollowersPagination: {
        type: 'object',
        properties: {
            take: {
                type: 'integer',
                example: 10,
            },
            after: {
                type: ['string', 'null'],
                example: 'ckv8p4u1q0000x3jz8d2b6g7h',
            },
            hasMore: {
                type: 'boolean',
                example: true,
            },
        },
        required: ['take', 'after', 'hasMore'],
    },
    UserFollowersData: {
        type: 'object',
        properties: {
            followers: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/UserFollowerItem',
                },
            },
        },
        required: ['followers'],
    },
    UserFollowersSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: USER_MESSAGE.GET_FOLLOWERS_SUCCESS,
            },
            data: {
                $ref: '#/components/schemas/UserFollowersData',
            },
        },
        required: ['success', 'message', 'data'],
    },
    UserFollowersPaginatedResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            data: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/UserFollowerItem',
                },
            },
            pagination: {
                $ref: '#/components/schemas/UserFollowersPagination',
            },
        },
        required: ['success', 'data', 'pagination'],
    },
    FriendRequestHandleRequest: {
        type: 'object',
        properties: {
            isAccept: {
                type: 'boolean',
                example: true,
            },
        },
        required: ['isAccept'],
    },
    FriendRequestItem: {
        type: 'object',
        properties: {
            id: { type: 'integer', example: 1 },
            senderId: { type: 'string', example: 'user-id-1' },
            receiverId: { type: 'string', example: 'user-id-2' },
            status: { type: 'string', example: 'PENDING' },
            createdAt: { type: 'string', format: 'date-time' },
        },
    },
    FriendRequestPaginatedResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/FriendRequestItem' },
            },
            pagination: { $ref: '#/components/schemas/UserFollowersPagination' },
        },
        required: ['success', 'data', 'pagination'],
    },
    UserFollowActionData: {
        type: 'object',
        properties: {
            isFollowing: {
                type: 'boolean',
                example: true,
            },
        },
        required: ['isFollowing'],
    },
    UserFollowActionSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: USER_MESSAGE.FOLLOW_SUCCESS,
            },
            data: {
                $ref: '#/components/schemas/UserFollowActionData',
            },
        },
        required: ['success', 'message', 'data'],
    },
    UserProfileData: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            name: { type: 'string', nullable: true },
            bio: { type: 'string', nullable: true },
            avatar: { type: 'string', nullable: true },
            verifiedAt: { type: 'string', format: 'date-time', nullable: true },
            followersCount: { type: 'integer' },
            followingCount: { type: 'integer' },
            postsCount: { type: 'integer' },
            isPrivate: { type: 'boolean' },
            location: { type: 'string', nullable: true },
            website: { type: 'string', nullable: true },
        },
        required: [
            'id', 'username', 'followersCount', 'followingCount', 'postsCount', 'isPrivate'
        ],
    },
    UserProfileSuccessResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'User fetched successfully' },
            data: { $ref: '#/components/schemas/UserProfileData' },
        },
        required: ['success', 'message', 'data'],
    },

};

const userIdPathParameter = [
    {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
            type: 'integer',
            example: 1,
        },
        description: 'Target id (e.g. friend request id)',
    },
];

const usernamePathParameter = [
    {
        name: 'username',
        in: 'path',
        required: true,
        schema: {
            type: 'string',
            example: 'john_doe',
        },
        description: 'Username',
    },
];

const followersPaginationQueryParameters = [
    {
        name: 'after',
        in: 'query',
        required: false,
        schema: {
            type: 'string',
            example: 'ckv8p4u1q0000x3jz8d2b6g7h',
        },
        description: 'Cursor (userId/senderId/receiverId) from previous response pagination.after',
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

export const userSwaggerPaths = {
    '/me/followers': {
        get: {
            tags: ['User'],
            summary: 'Get followers of current user',
            security: bearerAuthSecurity,
            parameters: followersPaginationQueryParameters,
            responses: {
                200: {
                    description: USER_MESSAGE.GET_FOLLOWERS_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserFollowersPaginatedResponse',
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
    '/me/friend-requests/received': {
        get: {
            tags: ['User'],
            summary: 'Get received friend requests',
            security: bearerAuthSecurity,
            parameters: followersPaginationQueryParameters,
            responses: {
                200: {
                    description: USER_MESSAGE.GET_RECEIVED_FRIEND_REQUESTS_SUCCESS,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/FriendRequestPaginatedResponse' },
                        },
                    },
                },
            },
        },
    },
    '/me/friend-requests/sent': {
        get: {
            tags: ['User'],
            summary: 'Get sent friend requests',
            security: bearerAuthSecurity,
            parameters: followersPaginationQueryParameters,
            responses: {
                200: {
                    description: USER_MESSAGE.GET_SENT_FRIEND_REQUESTS_SUCCESS,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/FriendRequestPaginatedResponse' },
                        },
                    },
                },
            },
        },
    },
    '/me/friend-requests/{username}': {
        patch: {
            tags: ['User'],
            summary: 'Accept or Reject friend request',
            security: bearerAuthSecurity,
            parameters: usernamePathParameter,
            requestBody: {
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/FriendRequestHandleRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: USER_MESSAGE.FRIEND_REQUEST_PROCESSED,
                },
            },
        },
    },
    '/user/{username}/followers': {
        get: {
            tags: ['User'],
            summary: 'Get followers of a user',
            security: [],
            parameters: [
                ...usernamePathParameter,
                ...followersPaginationQueryParameters,
            ],
            responses: {
                200: {
                    description: USER_MESSAGE.GET_FOLLOWERS_SUCCESS,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/UserFollowersPaginatedResponse' },
                        },
                    },
                },
            },
        },
    },
    '/user/{username}/following': {
        get: {
            tags: ['User'],
            summary: 'Get following of a user',
            security: [],
            parameters: [
                ...usernamePathParameter,
                ...followersPaginationQueryParameters,
            ],
            responses: {
                200: {
                    description: USER_MESSAGE.GET_FOLLOWING_SUCCESS,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/UserFollowersPaginatedResponse' },
                        },
                    },
                },
            },
        },
    },
    '/user/{username}/follower': {
        post: {
            tags: ['User'],
            summary: 'Follow/Unfollow toggle',
            security: bearerAuthSecurity,
            parameters: usernamePathParameter,
            responses: {
                200: {
                    description: USER_MESSAGE.FOLLOW_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserFollowActionSuccessResponse',
                            },
                        },
                    },
                },
            },
        },
    },
    '/user/{username}/friend-request': {
        post: {
            tags: ['User'],
            summary: 'Send friend request',
            security: bearerAuthSecurity,
            parameters: usernamePathParameter,
            responses: {
                200: {
                    description: USER_MESSAGE.FRIEND_REQUEST_SENT,
                },
            },
        },
    },
    '/users/{username}': {
        get: {
            tags: ['User'],
            summary: 'Get user profile by username',
            security: [],
            parameters: usernamePathParameter,
            responses: {
                200: {
                    description: 'User fetched successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserProfileSuccessResponse',
                            },
                        },
                    },
                },
                404: {
                    description: 'User not found',
                },
            },
        },
    },
};
