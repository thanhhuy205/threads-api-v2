import { COMMON_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const adminSwaggerSchemas = {
    AdminLoginRequest: {
        type: 'object',
        properties: {
            login: { type: 'string', example: 'admin@example.com' },
            password: { type: 'string', example: 'secret123' },
        },
        required: ['login', 'password'],
    },
    AdminLoginData: {
        type: 'object',
        properties: {
            user: {
                type: 'object',
                properties: {
                    email: { type: 'string', example: 'admin@example.com' },
                    username: { type: 'string', example: 'admin_user' },
                    name: { type: ['string', 'null'], example: 'Admin' },
                    bio: { type: ['string', 'null'], example: null },
                    avatar: { type: ['string', 'null'], example: null },
                },
                required: ['email', 'username'],
            },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            sessionId: { type: 'string' },
        },
        required: ['user', 'accessToken', 'refreshToken', 'sessionId'],
    },
    AdminLoginResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login success' },
            data: { $ref: '#/components/schemas/AdminLoginData' },
        },
        required: ['success', 'message', 'data'],
    },
    AdminUserItem: {
        type: 'object',
        properties: {
            id: { type: 'string', example: 'user_123' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            username: { type: 'string', example: 'johndoe' },
            status: { type: 'string', example: 'ACTIVE' },
            bannedUntil: { type: ['string', 'null'], format: 'date-time' },
            verifiedAt: { type: ['string', 'null'], format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            roles: { type: 'array', items: { type: 'string', example: 'USER' } },
            isVerified: { type: 'boolean', example: true },
        },
    },
    AdminOffsetPagination: {
        type: 'object',
        properties: {
            currentPage: { type: 'integer', example: 1 },
            perPage: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 128 },
            lastPage: { type: 'integer', example: 13 },
            from: { type: 'integer', example: 1 },
            to: { type: 'integer', example: 10 },
        },
        required: ['currentPage', 'perPage', 'total', 'lastPage', 'from', 'to'],
    },
    AdminUserListResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/AdminUserItem' },
            },
            pagination: { $ref: '#/components/schemas/AdminOffsetPagination' },
        },
        required: ['success', 'data', 'pagination'],
    },
    AdminBanUserResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'User banned successfully' },
            data: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    status: { type: 'string', example: 'BANNED' },
                },
            },
        },
    },
    AdminModerateReportRequest: {
        type: 'object',
        properties: {
            action: { type: 'string', enum: ['approve', 'hide_post', 'delete_post'], example: 'hide_post' },
        },
        required: ['action'],
    },
    AdminModerateReportResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Admin report moderation route ready' },
            data: { type: 'object' },
        },
    },
    AdminTrendingHashtagsResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'array', items: { $ref: '#/components/schemas/AdminTrendingHashtagItem' } },
            pagination: { $ref: '#/components/schemas/AdminOffsetPagination' },
        },
        required: ['success', 'data', 'pagination'],
    },
    AdminTrendingHashtagItem: {
        type: 'object',
        properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'typescript' },
            count: { type: 'integer', example: 42 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    AdminStatisticsResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Admin statistics route ready' },
            data: { type: 'object' },
        },
    },
};

export const adminSwaggerPaths = {
    '/admin/login': {
        post: {
            tags: ['Admin'],
            summary: 'Login admin or moderator account',
            security: [],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/AdminLoginRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Login success',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminLoginResponse' } } },
                },
                401: {
                    description: 'Invalid credentials',
                },
            },
        },
    },
    '/admin/users': {
        get: {
            tags: ['Admin'],
            summary: 'List all users for admin',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'page', in: 'query', schema: { type: 'number', example: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'number', example: 10 } },
            ],
            responses: {
                200: {
                    description: 'Users retrieved successfully',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminUserListResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
    },
    '/admin/users/{userId}/ban': {
        patch: {
            tags: ['Admin'],
            summary: 'Ban a user',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
                200: {
                    description: 'User banned successfully',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminBanUserResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
    },
    '/admin/reports/{reportId}': {
        patch: {
            tags: ['Admin'],
            summary: 'Moderate a report',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'reportId', in: 'path', required: true, schema: { type: 'string' } },
            ],
            requestBody: {
                content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminModerateReportRequest' } } },
            },
            responses: {
                200: {
                    description: 'Report moderated successfully',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminModerateReportResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
    },
    '/admin/hashtags/trending': {
        get: {
            tags: ['Admin'],
            summary: 'Get trending hashtags for admin',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'page', in: 'query', schema: { type: 'number', example: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'number', example: 10 } },
            ],
            responses: {
                200: {
                    description: 'Trending hashtags retrieved',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminTrendingHashtagsResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
    },
    '/admin/stats': {
        get: {
            tags: ['Admin'],
            summary: 'Get system statistics overview',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: 'Statistics retrieved',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminStatisticsResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
    },
};
