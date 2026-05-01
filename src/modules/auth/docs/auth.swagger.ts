export const authSwaggerSchemas = {
    AuthUser: {
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
                example: 'john_doe',
            },
            name: {
                type: 'string',
                nullable: true,
                example: 'John Doe',
            },
            bio: {
                type: 'string',
                nullable: true,
                example: 'Builds things.',
            },
            avatar: {
                type: 'string',
                nullable: true,
                example: 'https://cdn.example.com/avatar.png',
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
            },
            status: {
                type: 'integer',
                example: 0,
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
                example: 'Ho Chi Minh City',
            },
            website: {
                type: 'string',
                nullable: true,
                example: 'https://example.com',
            },
            deletedAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-05-01T00:00:00.000Z',
            },
            updatedAt: {
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
            'deletedAt',
            'createdAt',
            'updatedAt',
        ],
    },
    AuthRegisterRequest: {
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
            confirmPassword: {
                type: 'string',
                example: 'Password123',
            },
        },
        required: ['login', 'password', 'confirmPassword'],
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
    AuthResponseData: {
        allOf: [
            {
                $ref: '#/components/schemas/TokenPair',
            },
            {
                type: 'object',
                properties: {
                    user: {
                        $ref: '#/components/schemas/AuthUser',
                    },
                },
                required: ['user'],
            },
        ],
    },
    AuthSuccessResponse: {
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
                $ref: '#/components/schemas/AuthResponseData',
            },
        },
        required: ['success', 'message', 'data'],
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
                            login: 'john@example.com',
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
                                $ref: '#/components/schemas/AuthSuccessResponse',
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
                                $ref: '#/components/schemas/AuthSuccessResponse',
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
};