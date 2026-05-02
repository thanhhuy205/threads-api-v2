export const authSwaggerSchemas = {
    AuthRegisterRequest: {
        type: 'object',
        properties: {
            username: {
                type: 'string',
                description: 'Username',
                example: 'john_doe',
            },
            email: {
                type: 'string',
                format: 'email',
                description: 'Email address',
                example: 'john@example.com',
            },
            password: {
                type: 'string',
                example: 'Password123',
            },
            confirmPassword: {
                type: 'string',
                example: 'Password123',
            },
        },
        required: ['username', 'email', 'password', 'confirmPassword'],
    },
    AuthLoginRequest: {
        type: 'object',
        properties: {
            login: {
                type: 'string',
                description: 'Email or username',
                example: 'john@example.com',
            },
            password: {
                type: 'string',
                example: 'Password123',
            },
        },
        required: ['login', 'password'],
    },
    AuthLogoutRequest: {
        type: 'object',
        properties: {
            accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            refreshToken: {
                type: 'string',
                example: '14a39707c8cc5a8ea0421545e7f952171371586b1b4d98eb482e44c2b8d48884',
            },
        },
        required: ['accessToken', 'refreshToken'],
    },
    AuthSessionResponse: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                example: 'john@example.com',
            },
            username: {
                type: 'string',
                example: 'john@example.com',
            },
            name: {
                type: 'string',
                nullable: true,
                example: null,
            },
            bio: {
                type: 'string',
                nullable: true,
                example: null,
            },
            avatar: {
                type: 'string',
                nullable: true,
                example: null,
            },
            accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            refreshToken: {
                type: 'string',
                example: '14a39707c8cc5a8ea0421545e7f952171371586b1b4d98eb482e44c2b8d48884',
            },
            sessionId: {
                type: 'string',
                example: '661ff7eb-e344-4ea0-84ae-fc3a9d882466',
            },
        },
        required: ['email', 'username', 'name', 'bio', 'avatar', 'accessToken', 'refreshToken', 'sessionId'],
    },
    AuthMeResponse: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                example: 'ckv8p4u1q0000x3jz8d2b6g7h',
            },
            email: {
                type: 'string',
                format: 'email',
                example: 'john@example.com',
            },
            username: {
                type: 'string',
                example: 'john@example.com',
            },
            name: {
                type: 'string',
                nullable: true,
                example: null,
            },
            bio: {
                type: 'string',
                nullable: true,
                example: null,
            },
            avatar: {
                type: 'string',
                nullable: true,
                example: null,
            },
            role: {
                type: 'string',
                enum: ['USER', 'ADMIN'],
                example: 'USER',
            },
            verifiedAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                example: null,
            },
            status: {
                type: 'string',
                enum: ['ACTIVE', 'SUSPENDED', 'BANNED', 'DEACTIVATED'],
                example: 'ACTIVE',
            },
            followersCount: {
                type: 'integer',
                example: 0,
            },
            followingCount: {
                type: 'integer',
                example: 0,
            },
            postsCount: {
                type: 'integer',
                example: 0,
            },
            isPrivate: {
                type: 'boolean',
                example: false,
            },
            location: {
                type: 'string',
                nullable: true,
                example: null,
            },
            website: {
                type: 'string',
                nullable: true,
                example: null,
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-05-01T00:00:00.000Z',
            },
        },
        required: [
            'id',
            'email',
            'username',
            'name',
            'bio',
            'avatar',
            'role',
            'verifiedAt',
            'status',
            'followersCount',
            'followingCount',
            'postsCount',
            'isPrivate',
            'location',
            'website',
            'createdAt',
        ],
    },
    AuthSessionSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Register success',
            },
            data: {
                $ref: '#/components/schemas/AuthSessionResponse',
            },
        },
        required: ['success', 'message', 'data'],
    },
    AuthMeSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Get me success',
            },
            data: {
                $ref: '#/components/schemas/AuthMeResponse',
            },
        },
        required: ['success', 'message', 'data'],
    },
    AuthEmptySuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Logout success',
            },
        },
        required: ['success', 'message'],
    },
};

export const authSwaggerPaths = {
    '/auth/register': {
        post: {
            tags: ['Auth'],
            summary: 'Register a new user',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/AuthRegisterRequest',
                        },
                        example: {
                            username: 'john_doe',
                            email: 'john@example.com',
                            password: 'Password123',
                            confirmPassword: 'Password123',
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Register success',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthSessionSuccessResponse',
                            },
                        },
                    },
                },
                400: {
                    description: 'Validation failed',
                },
            },
        },
    },
    '/auth/login': {
        post: {
            tags: ['Auth'],
            summary: 'Login with email or username',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/AuthLoginRequest',
                        },
                        example: {
                            login: 'john@example.com',
                            password: 'Password123',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Login success',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthSessionSuccessResponse',
                            },
                        },
                    },
                },
                400: {
                    description: 'Validation failed',
                },
                401: {
                    description: 'Invalid credentials',
                },
            },
        },
    },
    '/auth/me': {
        get: {
            tags: ['Auth'],
            summary: 'Get current authenticated user',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Get me success',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthMeSuccessResponse',
                            },
                        },
                    },
                },
                401: {
                    description: 'Token invalid',
                },
                403: {
                    description: 'User banned',
                },
            },
        },
    },
    '/auth/logout': {
        post: {
            tags: ['Auth'],
            summary: 'Logout current session',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/AuthLogoutRequest',
                        },
                        example: {
                            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                            refreshToken: '14a39707c8cc5a8ea0421545e7f952171371586b1b4d98eb482e44c2b8d48884',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Logout success',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthEmptySuccessResponse',
                            },
                        },
                    },
                },
                400: {
                    description: 'Validation failed',
                },
            },
        },
    },
};