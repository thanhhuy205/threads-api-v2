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
            type: 'string',
            example: 'ckv8p4u1q0000x3jz8d2b6g7h',
        },
        description: 'Target user id',
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
        description: 'Follower userId cursor from previous response pagination.after',
    },
    {
        name: 'take',
        in: 'query',
        required: false,
        schema: {
            type: 'integer',
            example: 10,
        },
        description: 'Number of followers to return',
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
    '/user/{username}/follower': {
        post: {
            tags: ['User'],
            summary: 'Follow a user by username',
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
                            example: {
                                success: true,
                                message: USER_MESSAGE.FOLLOW_SUCCESS,
                                data: {
                                    isFollowing: true,
                                },
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
    '/users/{username}': {
        get: {
            tags: ['User'],
            summary: 'Get user profile by username',
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
