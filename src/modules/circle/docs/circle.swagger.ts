import { COMMON_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const circleSwaggerSchemas = {
    CreateCircleRequest: {
        type: 'object',
        properties: {
            name: { type: 'string', example: 'my-circle' },
            description: { type: 'string', example: 'A circle for sharing useful experiences and ideas.' },
            avatarEmoji: { type: 'string', example: '🔥', description: 'Optional single emoji used as the circle avatar.' },
            visibility: { type: 'string', example: 'PUBLIC' },
        },
        required: ['name', 'description'],
    },
    CircleItem: {
        type: 'object',
        properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'my-circle' },
            avatarEmoji: { type: ['string', 'null'], example: '🔥' },
            userId: { type: 'string', example: 'user_123' },
            visibility: { type: 'string', example: 'PUBLIC' },
            createById: { type: 'string', example: 'user_123' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'userId', 'visibility', 'createById', 'createdAt', 'updatedAt'],
    },
    CircleEnergyItem: {
        type: 'object',
        properties: {
            current: { type: 'number', example: 500 },
            max: { type: 'number', example: 500 },
            peak: { type: 'number', example: 500 },
            createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['current', 'max', 'peak', 'createdAt'],
    },
    CircleLevelConfigItem: {
        type: 'object',
        properties: {
            level: { type: 'number', example: 2 },
            name: { type: 'string', example: 'Growing' },
            requiredExp: { type: 'number', example: 200 },
            maxHp: { type: 'number', example: 650 },
            drainPerHour: { type: 'number', example: 9 },
        },
        required: ['level', 'name', 'requiredExp', 'maxHp', 'drainPerHour'],
    },
    CircleDetailItem: {
        type: 'object',
        properties: {
            id: { type: 'number', example: 1 },
            publicId: { type: 'string', example: 'clr_123' },
            name: { type: 'string', example: 'Vòng tròn' },
            description: { type: 'string', example: 'Một circle mẫu để xem chi tiết' },
            avatarEmoji: { type: ['string', 'null'], example: '🔥' },
            visibility: { type: 'string', example: 'PUBLIC' },
            memberCount: { type: 'number', example: 0 },
            energy: { $ref: '#/components/schemas/CircleEnergyItem' },
            nextLevelConfig: {
                allOf: [{ $ref: '#/components/schemas/CircleLevelConfigItem' }],
                nullable: true,
            },
            isJoined: { type: 'boolean', example: false },
            isAdmin: { type: 'boolean', example: false },
            permission: {
                type: 'array',
                items: { type: 'string' },
                example: ['VIEW', 'COMMENT'],
            },
            isRestrictedKarma: { type: 'boolean', example: false },
            inInvitation: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
        required: [
            'id',
            'publicId',
            'name',
            'description',
            'visibility',
            'memberCount',
            'energy',
            'nextLevelConfig',
            'isJoined',
            'isAdmin',
            'permission',
            'isRestrictedKarma',
            'inInvitation',
            'createdAt',
            'updatedAt',
        ],
    },
    CircleMemberUserItem: {
        type: 'object',
        properties: {
            name: { type: 'string', example: 'Jane Doe', nullable: true },
            username: { type: 'string', example: 'jane_doe' },
            avatar: { type: 'string', example: 'https://cdn.example.com/avatar.png', nullable: true },
            bio: { type: 'string', example: 'Full-stack developer', nullable: true },
        },
        required: ['username'],
    },
    CircleMemberItem: {
        type: 'object',
        properties: {
            id: { type: 'number', example: 10 },
            circleId: { type: 'number', example: 1 },
            userId: { type: 'string', example: 'user_123' },
            role: { type: 'string', example: 'MEMBER' },
            createdAt: { type: 'string', format: 'date-time' },
            user: { $ref: '#/components/schemas/CircleMemberUserItem' },
        },
        required: ['id', 'circleId', 'userId', 'role', 'createdAt', 'user'],
    },
    CircleInvitationItem: {
        type: 'object',
        properties: {
            userId: { type: 'string', example: 'user_456' },
            id: { type: 'number', example: 12 },
            status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'], example: 'PENDING' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            circleId: { type: 'number', example: 1 },
            inviterId: { type: 'string', example: 'user_123' },
        },
        required: ['userId', 'id', 'status', 'createdAt', 'updatedAt', 'circleId', 'inviterId'],
    },
    CircleInvitationStatsItem: {
        type: 'object',
        properties: {
            circlePublicId: { type: 'string', example: 'clr_123' },
            pending: { type: 'number', example: 3 },
            accepted: { type: 'number', example: 15 },
            rejected: { type: 'number', example: 2 },
        },
        required: ['circlePublicId', 'pending', 'accepted', 'rejected'],
    },
    CircleInvitationStatsResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Circle invitation stats retrieved successfully' },
            data: { $ref: '#/components/schemas/CircleInvitationStatsItem' },
        },
        required: ['success', 'message', 'data'],
    },
    CursorPagination: {
        type: 'object',
        properties: {
            take: { type: 'number', example: 10 },
            after: { type: ['string', 'number', 'null'], example: 'cuid_string_here' },
            hasMore: { type: 'boolean', example: true },
        },
        required: ['take', 'hasMore'],
    },
    CreateCircleResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Circle created successfully' },
            data: { $ref: '#/components/schemas/CircleItem' },
        },
        required: ['success', 'message', 'data'],
    },
    CircleDetailResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Circle detail retrieved successfully' },
            data: { $ref: '#/components/schemas/CircleDetailItem' },
        },
        required: ['success', 'message', 'data'],
    },
    CircleMembersResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'array', items: { $ref: '#/components/schemas/CircleMemberItem' } },
            pagination: { $ref: '#/components/schemas/CursorPagination' },
        },
        required: ['success', 'data', 'pagination'],
    },
    CircleListResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Circles retrieved' },
            data: {
                type: 'object',
                properties: {
                    items: { type: 'array', items: { $ref: '#/components/schemas/CircleItem' } },
                    pagination: { $ref: '#/components/schemas/CursorPagination' },
                },
            },
        },
        required: ['success', 'message', 'data'],
    },
    SendInvitationRequest: {
        type: 'object',
        properties: {
            circleId: { type: 'number', example: 1 },
            userId: { type: 'string', example: 'user_456' },
        },
        required: ['circleId', 'userId'],
    },
    SendInvitationResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Invitation sent' },
        },
        required: ['success', 'message'],
    },
    ResponseInvitationRequest: {
        type: 'object',
        properties: {
            circleId: { type: 'number', example: 1 },
            status: { type: 'string', enum: ['ACCEPTED', 'REJECTED'] },
        },
        required: ['circleId', 'status'],
    },
    ResponseInvitationResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Invitation response recorded' },
        },
        required: ['success', 'message'],
    },
    RespondJoinRequestRequest: {
        type: 'object',
        properties: {
            userId: { type: 'string', example: 'user_xin_vao_nhom' },
            isAccept: { type: 'boolean', example: true },
        },
        required: ['userId', 'isAccept'],
    },
    RespondJoinRequestResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Join request accept for user user_xin_vao_nhom to join circle circle_public_id' },
        },
        required: ['success', 'message'],
    },
    ResendInvitationRequest: {
        type: 'object',
        properties: {
            id: { type: 'number', example: 3611 },
        },
        required: ['id'],
    },
    ResendInvitationItem: {
        type: 'object',
        properties: {
            circlePublicId: { type: 'string', example: 'clr_123' },
            id: { type: 'number', example: 3611 },
            userId: { type: 'string', example: 'user_456', nullable: true },
            email: { type: 'string', example: 'invited@example.com', nullable: true },
            status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'], example: 'PENDING' },
            resentCount: { type: 'number', example: 2 },
            inviterId: { type: 'string', example: 'user_admin' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['circlePublicId', 'id', 'status', 'resentCount', 'inviterId', 'updatedAt'],
    },
    ResendInvitationResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Circle invitation resent successfully' },
            data: { $ref: '#/components/schemas/ResendInvitationItem' },
        },
        required: ['success', 'message', 'data'],
    },
    CircleInvitationMeItem: {
        type: 'object',
        properties: {
            circle: {
                type: 'object',
                properties: {
                    publicId: { type: 'string', example: 'clr_123' },
                    name: { type: 'string', example: 'Vong tron thu vi' },
                    visibility: { type: 'string', example: 'PRIVATE' },
                },
                required: ['publicId', 'name', 'visibility'],
            },
            userId: { type: 'string', example: 'user_456', nullable: true },
            email: { type: 'string', example: 'invited@example.com', nullable: true },
            role: { type: 'string', example: 'MEMBER', nullable: true },
            status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'], example: 'PENDING' },
            isUser: { type: 'boolean', example: true },
            resentCount: { type: 'number', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            inviter: {
                type: 'object',
                nullable: true,
                properties: {
                    id: { type: 'string', example: 'user_admin' },
                    name: { type: 'string', example: 'Admin' },
                    username: { type: 'string', example: 'admin' },
                    avatar: { type: 'string', nullable: true, example: 'https://cdn.example.com/avatar.png' },
                    bio: { type: 'string', nullable: true, example: 'Circle admin' },
                },
            },
        },
        required: ['circle', 'status', 'isUser', 'resentCount', 'createdAt', 'updatedAt'],
    },
    CircleInvitationMeResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Circle invitation detail retrieved successfully' },
            data: { $ref: '#/components/schemas/CircleInvitationMeItem' },
        },
        required: ['success', 'message', 'data'],
    },
    RequestInvitationResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/CircleInvitationItem' },
            },
            pagination: { $ref: '#/components/schemas/CursorPagination' },
        },
        required: ['success', 'data', 'pagination'],
    },
    CirclePostRequest: {
        type: 'object',
        properties: {
            content: { type: 'string', example: 'This is my circle post about deep thinking and personal growth', maxLength: 5000 },
            contentJson: {
                type: 'object',
                nullable: true,
                additionalProperties: true,
                example: { type: 'doc', blocks: [{ type: 'paragraph', text: 'This is my circle post' }] },
            },
            parentId: { type: 'integer', example: 101, nullable: true },
        },
        required: ['content'],
    },
    CirclePostItem: {
        type: 'object',
        properties: {
            postId: { type: 'number', example: 1001 },
            content: { type: 'string', example: 'This is my circle post' },
            contentJson: {
                type: 'object',
                nullable: true,
                additionalProperties: true,
                example: { type: 'doc', blocks: [{ type: 'paragraph', text: 'This is my circle post' }] },
            },
            qualityScore: { type: 'number', format: 'float', example: 0.91 },
            judgeStatus: { type: 'string', enum: ['pending', 'done', 'failed'], example: 'done' },
            createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['postId', 'content', 'qualityScore', 'judgeStatus', 'createdAt'],
    },
    CirclePostResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Post accepted for judging' },
            data: { $ref: '#/components/schemas/CirclePostItem' },
        },
        required: ['success', 'message', 'data'],
    },
    CircleAiMarkdownRequest: {
        type: 'object',
        properties: {
            textNguoiDung: { type: 'string', example: 'Please format this as clean markdown.' },
        },
        required: ['textNguoiDung'],
    },
    CircleAiMarkdownData: {
        type: 'object',
        properties: {
            markdown: { type: 'string', example: '# Title\n\n- Item one\n- Item two' },
        },
        required: ['markdown'],
    },
    CircleAiMarkdownResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Markdown generated' },
            data: { $ref: '#/components/schemas/CircleAiMarkdownData' },
        },
        required: ['success', 'message', 'data'],
    },
};

export const circleSwaggerPaths = {
    '/circle-ai/generate-response': {
        post: {
            tags: ['Circle'],
            summary: 'Generate markdown from text',
            security: bearerAuthSecurity,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CircleAiMarkdownRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Markdown generated',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CircleAiMarkdownResponse' } } },
                },
                400: { description: COMMON_MESSAGE.BAD_REQUEST },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
            },
        },
    },
    '/circle': {
        get: {
            tags: ['Circle'],
            summary: 'List circles',
            parameters: [
                { name: 'after', in: 'query', schema: { type: 'string' } },
                { name: 'take', in: 'query', schema: { type: 'number' } },
            ],
            responses: {
                200: {
                    description: 'Circles retrieved',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CircleListResponse' } } },
                },
            },
        },
        post: {
            tags: ['Circle'],
            summary: 'Create a circle',
            security: bearerAuthSecurity,
            requestBody: {
                content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCircleRequest' } } },
            },
            responses: {
                201: {
                    description: 'Circle created',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCircleResponse' } } },
                },
                400: { description: COMMON_MESSAGE.BAD_REQUEST },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
            },
        },
    },
    '/circle/{publicId}': {
        get: {
            tags: ['Circle'],
            summary: 'Get circle detail by publicId',
            parameters: [
                { name: 'publicId', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
                200: {
                    description: 'Circle detail retrieved',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CircleDetailResponse' } } },
                },
                404: { description: COMMON_MESSAGE.NOT_FOUND },
            },
        },
    },
    '/circle/{publicId}/members': {
        get: {
            tags: ['Circle'],
            summary: 'Get circle members by publicId',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'publicId', in: 'path', required: true, schema: { type: 'string' } },
                { name: 'after', in: 'query', schema: { type: 'string', example: 'user_123' } },
                { name: 'take', in: 'query', schema: { type: 'number', example: 10 } },
            ],
            responses: {
                200: {
                    description: 'Circle members retrieved',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CircleMembersResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                404: { description: COMMON_MESSAGE.NOT_FOUND },
            },
        },
    },
    '/circle/send-invitation': {
        post: {
            tags: ['Circle'],
            summary: 'Send invitation to join a circle',
            security: bearerAuthSecurity,
            requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SendInvitationRequest' } } } },
            responses: {
                200: { description: 'Invitation sent', content: { 'application/json': { schema: { $ref: '#/components/schemas/SendInvitationResponse' } } } },
                400: { description: COMMON_MESSAGE.BAD_REQUEST },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
            },
        },
    },
    '/circle/request-invitation': {
        get: {
            tags: ['Circle'],
            summary: 'Get current user circle invitations',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'after', in: 'query', schema: { type: 'string', example: '1' } },
                { name: 'take', in: 'query', schema: { type: 'number', example: 10 } },
            ],
            responses: {
                200: {
                    description: 'Circle invitations retrieved',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/RequestInvitationResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
            },
        },
    },
    '/circle/invitations/me/{publicId}': {
        get: {
            tags: ['Circle'],
            summary: 'Get current user invitation detail in a circle',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'publicId', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
                200: {
                    description: 'Circle invitation detail retrieved',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CircleInvitationMeResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                404: { description: COMMON_MESSAGE.NOT_FOUND },
            },
        },
    },
    '/circle/me/owner-circle': {
        get: {
            tags: ['Circle'],
            summary: 'Get circles where current user is ADMIN or OWNER',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'after', in: 'query', schema: { type: 'string', example: 'cuid_string_here' } },
                { name: 'take', in: 'query', schema: { type: 'number', example: 10 } },
            ],
            responses: {
                200: {
                    description: 'Owner/admin circles retrieved',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CircleListResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
            },
        },
    },
    '/circle/response-invitation': {
        post: {
            tags: ['Circle'],
            summary: 'Respond to a circle invitation',
            security: bearerAuthSecurity,
            requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ResponseInvitationRequest' } } } },
            responses: {
                200: { description: 'Invitation response recorded', content: { 'application/json': { schema: { $ref: '#/components/schemas/ResponseInvitationResponse' } } } },
                400: { description: COMMON_MESSAGE.BAD_REQUEST },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
            },
        },
    },
    '/circle/{publicId}/manage/join-request/respond': {
        post: {
            tags: ['Circle'],
            summary: 'Accept or reject a circle join request',
            description: 'Admin/owner endpoint for approving a user who requested to join a circle. Requires ACCEPT_USE_JOIN permission. Accepting a request creates a JOIN_CIRCLE user action log.',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'publicId', in: 'path', required: true, schema: { type: 'string' }, description: 'Circle public ID' },
            ],
            requestBody: {
                required: true,
                content: { 'application/json': { schema: { $ref: '#/components/schemas/RespondJoinRequestRequest' } } },
            },
            responses: {
                200: {
                    description: 'Join request response recorded',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/RespondJoinRequestResponse' } } },
                },
                400: { description: COMMON_MESSAGE.BAD_REQUEST },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: 'Requires ACCEPT_USE_JOIN permission' },
                404: { description: COMMON_MESSAGE.NOT_FOUND },
            },
        },
    },
    '/circle/{publicId}/manage/invitations/stats': {
        get: {
            tags: ['Circle'],
            summary: 'Get invitation stats for circle management',
            description: 'Returns invitation totals by status for a circle. Requires ACCEPT_USE_JOIN permission.',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'publicId', in: 'path', required: true, schema: { type: 'string' }, description: 'Circle public ID' },
            ],
            responses: {
                200: {
                    description: 'Circle invitation stats retrieved',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CircleInvitationStatsResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: 'Requires ACCEPT_USE_JOIN permission' },
                404: { description: COMMON_MESSAGE.NOT_FOUND },
            },
        },
    },
    '/circle/{publicId}/manage/resend': {
        post: {
            tags: ['Circle'],
            summary: 'Resend an invitation in circle management',
            description: 'Resend invitation by invitation ID in a managed circle. Requires ACCEPT_USE_JOIN permission.',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'publicId', in: 'path', required: true, schema: { type: 'string' }, description: 'Circle public ID' },
            ],
            requestBody: {
                required: true,
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ResendInvitationRequest' } } },
            },
            responses: {
                200: {
                    description: 'Circle invitation resent successfully',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ResendInvitationResponse' } } },
                },
                400: { description: COMMON_MESSAGE.BAD_REQUEST },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: 'Requires ACCEPT_USE_JOIN permission' },
                404: { description: COMMON_MESSAGE.NOT_FOUND },
            },
        },
    },
    '/circle/{publicId}/posts': {
        post: {
            tags: ['Circle'],
            summary: 'Create a post in circle',
            description: 'Create a new post in a circle for quality evaluation. Post is accepted (202) and queued for judging.',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'publicId', in: 'path', required: true, schema: { type: 'string' }, description: 'Circle public ID' },
            ],
            requestBody: {
                required: true,
                content: { 'application/json': { schema: { $ref: '#/components/schemas/CirclePostRequest' } } },
            },
            responses: {
                202: {
                    description: 'Post accepted for judging',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CirclePostResponse' } } },
                },
                400: { description: COMMON_MESSAGE.BAD_REQUEST },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: 'User is restricted from posting' },
                404: { description: 'Circle not found' },
                429: { description: 'Rate limit exceeded: maximum 5 posts per hour' },
            },
        },
    },
};
