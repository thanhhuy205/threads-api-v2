import { AUTH_MESSAGE, COMMON_MESSAGE, USER_INTENT_MESSAGE, USER_MESSAGE } from '@/constants/message';

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
    UserFollowActionData: {
        type: 'object',
        properties: {
            following: {
                type: 'boolean',
                example: true,
            },
        },
        required: ['following'],
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
    UserIntentRequest: {
        type: 'object',
        properties: {
            positiveText: {
                type: 'string',
                maxLength: 255,
                example: 'technology, startups, AI',
            },
            negativeText: {
                type: 'string',
                maxLength: 255,
                example: 'spam, clickbait',
            },
        },
    },
    UserIntentMessageResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: USER_INTENT_MESSAGE.RETRIEVED,
            },
        },
        required: ['success', 'message'],
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

export const userSwaggerPaths = {
    '/users/{id}/followers': {
        get: {
            tags: ['User'],
            summary: 'Get followers by user id',
            parameters: userIdPathParameter,
            responses: {
                200: {
                    description: USER_MESSAGE.GET_FOLLOWERS_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserFollowersSuccessResponse',
                            },
                        },
                    },
                },
            },
        },
    },
    '/users/{id}/follow': {
        post: {
            tags: ['User'],
            summary: 'Follow a user',
            security: bearerAuthSecurity,
            parameters: userIdPathParameter,
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
                                    following: true,
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
    '/user/{id}/follow': {
        post: {
            tags: ['User'],
            summary: 'Unfollow a user',
            security: bearerAuthSecurity,
            parameters: userIdPathParameter,
            responses: {
                200: {
                    description: USER_MESSAGE.UNFOLLOW_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserFollowActionSuccessResponse',
                            },
                            example: {
                                success: true,
                                message: USER_MESSAGE.UNFOLLOW_SUCCESS,
                                data: {
                                    following: false,
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
    '/me/feed-intent': {
        get: {
            tags: ['User'],
            summary: 'Get current user feed intent',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: USER_INTENT_MESSAGE.RETRIEVED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserIntentMessageResponse',
                            },
                        },
                    },
                },
                401: {
                    description: AUTH_MESSAGE.TOKEN_INVALID,
                },
            },
        },
        post: {
            tags: ['User'],
            summary: 'Create current user feed intent',
            security: bearerAuthSecurity,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/UserIntentRequest',
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: USER_INTENT_MESSAGE.CREATED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserIntentMessageResponse',
                            },
                            example: {
                                success: true,
                                message: USER_INTENT_MESSAGE.CREATED,
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
        patch: {
            tags: ['User'],
            summary: 'Update current user feed intent',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: USER_INTENT_MESSAGE.UPDATED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserIntentMessageResponse',
                            },
                            example: {
                                success: true,
                                message: USER_INTENT_MESSAGE.UPDATED,
                            },
                        },
                    },
                },
                401: {
                    description: AUTH_MESSAGE.TOKEN_INVALID,
                },
            },
        },
        delete: {
            tags: ['User'],
            summary: 'Delete current user feed intent',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: USER_INTENT_MESSAGE.DELETED,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserIntentMessageResponse',
                            },
                            example: {
                                success: true,
                                message: USER_INTENT_MESSAGE.DELETED,
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
