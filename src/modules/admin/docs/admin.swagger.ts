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
            message: { type: 'string', example: 'Users retrieved successfully' },
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/AdminUserItem' },
            },
            pagination: { $ref: '#/components/schemas/AdminOffsetPagination' },
        },
        required: ['success', 'message', 'data', 'pagination'],
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
    AdminReportTargetPost: {
        type: 'object',
        nullable: true,
        properties: {
            publicId: { type: 'string', example: 'post_123' },
            userId: { type: 'string', example: 'user_123' },
            content: { type: 'string', example: 'Reported post content' },
            type: { type: 'string', example: 'POST' },
            visibility: { type: 'string', example: 'PUBLIC' },
            isDeleted: { type: 'boolean', example: false },
            isHidden: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
        },
    },
    AdminReportTargetUser: {
        type: 'object',
        nullable: true,
        properties: {
            id: { type: 'string', example: 'user_456' },
            username: { type: 'string', example: 'reported_user' },
            name: { type: ['string', 'null'], example: 'Reported User' },
            avatar: { type: ['string', 'null'], example: null },
            email: { type: 'string', example: 'reported@example.com' },
            status: { type: 'string', example: 'ACTIVE' },
            createdAt: { type: 'string', format: 'date-time' },
        },
    },
    AdminReportReporter: {
        type: 'object',
        properties: {
            id: { type: 'string', example: 'user_123' },
            username: { type: 'string', example: 'reporter' },
            name: { type: ['string', 'null'], example: 'Reporter' },
            avatar: { type: ['string', 'null'], example: null },
            email: { type: 'string', example: 'reporter@example.com' },
        },
    },
    AdminReportItem: {
        type: 'object',
        properties: {
            id: { type: 'string', example: 'cm_report_123' },
            reporterId: { type: 'string', example: 'user_123' },
            reporter: { $ref: '#/components/schemas/AdminReportReporter' },
            targetType: { type: 'string', enum: ['POST', 'USER', 'CIRCLE'], example: 'POST' },
            targetId: { type: 'string', example: 'post_123' },
            reason: { type: 'string', example: 'Spam content' },
            status: { type: 'string', enum: ['PENDING', 'RESOLVED', 'DISMISSED'], example: 'PENDING' },
            assistantNote: { type: ['string', 'null'], example: 'Potential spam' },
            confidence: { type: ['number', 'null'], example: 0.82 },
            adminNote: { type: ['string', 'null'], example: null },
            createdAt: { type: 'string', format: 'date-time' },
            post: { $ref: '#/components/schemas/AdminReportTargetPost' },
            targetUser: { $ref: '#/components/schemas/AdminReportTargetUser' },
        },
    },
    AdminReportListResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Reports retrieved successfully' },
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/AdminReportItem' },
            },
            pagination: { $ref: '#/components/schemas/AdminOffsetPagination' },
        },
        required: ['success', 'message', 'data', 'pagination'],
    },
    AdminTrendingHashtagsResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Admin trending hashtags route ready' },
            data: { type: 'array', items: { $ref: '#/components/schemas/AdminTrendingHashtagItem' } },
            pagination: { $ref: '#/components/schemas/AdminOffsetPagination' },
        },
        required: ['success', 'message', 'data', 'pagination'],
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
    AdminDailyQuestCreateRequest: {
        type: 'object',
        properties: {
            code: { type: 'string', example: 'COMMENT_3' },
            description: { type: 'string', example: 'Binh luan 3 lan trong ngay' },
            karmaReward: { type: 'integer', example: 1 },
            requirement: { type: 'integer', example: 3 },
            action: { type: 'string', example: 'POST_CREATED' },
        },
        required: ['code', 'description', 'karmaReward', 'requirement', 'action'],
    },
    AdminDailyQuestActionOption: {
        type: 'object',
        properties: {
            value: { type: 'string', example: 'POST_CREATED' },
            label: { type: 'string', example: 'Đăng bài' },
            unit: { type: 'string', example: 'bài' },
        },
        required: ['value', 'label', 'unit'],
    },
    AdminDailyQuestActionsResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Daily quest actions retrieved successfully' },
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/AdminDailyQuestActionOption' },
            },
        },
        required: ['success', 'message', 'data'],
    },
    AdminDailyQuestItem: {
        type: 'object',
        properties: {
            id: { type: 'integer', example: 1 },
            code: { type: 'string', example: 'COMMENT_3' },
            description: { type: 'string', example: 'Binh luan 3 lan trong ngay' },
            karmaReward: { type: 'integer', example: 1 },
            requirement: { type: 'integer', example: 3 },
            action: { type: 'string', example: 'POST_CREATED' },
            isActive: { type: 'boolean', example: true },
            createById: { type: 'string', example: 'clyzz4pba0000v9d0m3f6x2a1' },
            createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'code', 'description', 'karmaReward', 'requirement', 'action', 'isActive', 'createById', 'createdAt'],
    },
    AdminDailyQuestCreateResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Daily quest created successfully' },
            data: { $ref: '#/components/schemas/AdminDailyQuestItem' },
        },
        required: ['success', 'message', 'data'],
    },
    AdminDailyQuestListResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Daily quests retrieved successfully' },
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/AdminDailyQuestItem' },
            },
            pagination: { $ref: '#/components/schemas/AdminOffsetPagination' },
        },
        required: ['success', 'message', 'data', 'pagination'],
    },
    AdminDailyQuestDisableResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Daily quest disabled successfully' },
            data: { $ref: '#/components/schemas/AdminDailyQuestItem' },
        },
        required: ['success', 'message', 'data'],
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
    '/admin/reports': {
        get: {
            tags: ['Admin'],
            summary: 'List reports for admin',
            description: 'List reports by target type. type defaults to post. For type post or circle, target data is returned in post. For type user, target data is returned in targetUser.',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'page', in: 'query', schema: { type: 'number', example: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'number', example: 10 } },
                {
                    name: 'type',
                    in: 'query',
                    schema: { type: 'string', enum: ['post', 'user', 'circle'], default: 'post' },
                },
            ],
            responses: {
                200: {
                    description: 'Reports retrieved successfully',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminReportListResponse' } } },
                },
                400: { description: COMMON_MESSAGE.VALIDATION_FAILED },
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
    '/admin/daily-quests': {
        post: {
            tags: ['Admin'],
            summary: 'Create daily quest',
            security: bearerAuthSecurity,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/AdminDailyQuestCreateRequest' },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Daily quest created successfully',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminDailyQuestCreateResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
        get: {
            tags: ['Admin'],
            summary: 'List active daily quests',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'page', in: 'query', schema: { type: 'number', example: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'number', example: 10 } },
            ],
            responses: {
                200: {
                    description: 'Daily quests retrieved successfully',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminDailyQuestListResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
    },
    '/admin/daily-quests/actions': {
        get: {
            tags: ['Admin'],
            summary: 'List daily quest action options',
            description: 'Returns action metadata from the ActionType enum. This endpoint does not query the database.',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: 'Daily quest actions retrieved successfully',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminDailyQuestActionsResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
    },
    '/admin/daily-quests/{code}/disable': {
        patch: {
            tags: ['Admin'],
            summary: 'Disable daily quest',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'code', in: 'path', required: true, schema: { type: 'string', example: 'COMMENT_3' } },
            ],
            responses: {
                200: {
                    description: 'Daily quest disabled successfully',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminDailyQuestDisableResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
    },
};
