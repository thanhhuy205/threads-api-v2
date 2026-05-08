import { AUTH_MESSAGE, COMMON_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

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
    AuthForgotPasswordRequest: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                example: 'john@example.com',
            },
        },
        required: ['email'],
    },
    AuthRefreshTokenRequest: {
        type: 'object',
        properties: {
            refreshToken: {
                type: 'string',
                example: '14a39707c8cc5a8ea0421545e7f952171371586b1b4d98eb482e44c2b8d48884',
            },
        },
        required: ['refreshToken'],
    },
    AuthUpdateProfileRequest: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                example: 'John Doe',
            },
            bio: {
                type: 'string',
                example: 'Building in public',
            },
            location: {
                type: 'string',
                example: 'Ho Chi Minh City',
            },
            website: {
                type: 'string',
                example: 'https://example.com',
            },
            avatar: {
                type: 'string',
                nullable: true,
                example: 'https://cdn.example.com/avatar.png',
            },
        },
    },
    AuthValidateEmailRequest: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                example: 'john@example.com',
            },
        },
        required: ['email'],
    },
    AuthValidateUsernameRequest: {
        type: 'object',
        properties: {
            username: {
                type: 'string',
                example: 'john_doe',
            },
        },
        required: ['username'],
    },
    AuthValidateTokenRequest: {
        type: 'object',
        properties: {
            token: {
                type: 'string',
                example: 'f8c7f1b8d2a44c7c9f3f2a1b0c9d8e7f',
            },
        },
        required: ['token'],
    },
    AuthResetPasswordRequest: {
        type: 'object',
        properties: {
            token: {
                type: 'string',
                example: 'f8c7f1b8d2a44c7c9f3f2a1b0c9d8e7f',
            },
            email: {
                type: 'string',
                format: 'email',
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
        required: ['token', 'email', 'password', 'confirmPassword'],
    },
    AuthLogoutRequest: {
        type: 'object',
        properties: {
            refreshToken: {
                type: 'string',
                example: '14a39707c8cc5a8ea0421545e7f952171371586b1b4d98eb482e44c2b8d48884',
            },
        },
        required: ['refreshToken'],
    },
    AuthTokenPairResponse: {
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
            sessionId: {
                type: 'string',
                example: '661ff7eb-e344-4ea0-84ae-fc3a9d882466',
            },
        },
        required: ['accessToken', 'refreshToken', 'sessionId'],
    },
    AuthForgotPasswordResponse: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                example: 'john@example.com',
            },
        },
        required: ['email'],
    },
    AuthValidateUserResponse: {
        type: 'object',
        properties: {
            available: {
                type: 'boolean',
                example: true,
            },
        },
        required: ['available'],
    },
    AuthValidateEmailSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: AUTH_MESSAGE.VALIDATE_EMAIL_SUCCESS,
            },
            data: {
                $ref: '#/components/schemas/AuthValidateUserResponse',
            },
        },
        required: ['success', 'message', 'data'],
    },
    AuthValidateUsernameSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: AUTH_MESSAGE.VALIDATE_USERNAME_SUCCESS,
            },
            data: {
                $ref: '#/components/schemas/AuthValidateUserResponse',
            },
        },
        required: ['success', 'message', 'data'],
    },
    AuthValidateTokenResponse: {
        type: 'object',
        properties: {
            valid: {
                type: 'boolean',
                example: true,
            },
        },
        required: ['valid'],
    },
    AuthUpdateProfileResponse: {
        type: 'object',
        properties: {
            updated: {
                type: 'boolean',
                example: true,
            },
        },
        required: ['updated'],
    },
    AuthMessageSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: AUTH_MESSAGE.LOGOUT_SUCCESS,
            },
        },
        required: ['success', 'message'],
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
                example: AUTH_MESSAGE.REGISTER_SUCCESS,
            },
            data: {
                $ref: '#/components/schemas/AuthSessionResponse',
            },
        },
        required: ['success', 'message', 'data'],
    },
    AuthTokenPairSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: AUTH_MESSAGE.REFRESH_TOKEN_SUCCESS,
            },
            data: {
                $ref: '#/components/schemas/AuthTokenPairResponse',
            },
        },
        required: ['success', 'message', 'data'],
    },
    AuthForgotPasswordSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: AUTH_MESSAGE.FORGOT_PASSWORD_SUCCESS,
            },
            data: {
                $ref: '#/components/schemas/AuthForgotPasswordResponse',
            },
        },
        required: ['success', 'message', 'data'],
    },
    AuthValidateUserSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: AUTH_MESSAGE.VALIDATE_EMAIL_SUCCESS,
            },
            data: {
                $ref: '#/components/schemas/AuthValidateUserResponse',
            },
        },
        required: ['success', 'message', 'data'],
    },
    AuthValidateTokenSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: AUTH_MESSAGE.VALIDATE_RESET_PASSWORD_TOKEN_SUCCESS,
            },
            data: {
                $ref: '#/components/schemas/AuthValidateTokenResponse',
            },
        },
        required: ['success', 'message', 'data'],
    },
    AuthUpdateProfileSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: AUTH_MESSAGE.UPDATE_USER_SUCCESS,
            },
            data: {
                $ref: '#/components/schemas/AuthUpdateProfileResponse',
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
                example: AUTH_MESSAGE.GET_ME_SUCCESS,
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
                example: AUTH_MESSAGE.LOGOUT_SUCCESS,
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
                    description: AUTH_MESSAGE.REGISTER_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthSessionSuccessResponse',
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
                    description: AUTH_MESSAGE.LOGIN_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthSessionSuccessResponse',
                            },
                        },
                    },
                },
                400: {
                    description: COMMON_MESSAGE.VALIDATION_FAILED,
                },
                401: {
                    description: AUTH_MESSAGE.INVALID_CREDENTIALS,
                },
            },
        },
    },
    '/auth/forgot-password': {
        post: {
            tags: ['Auth'],
            summary: 'Request a forgot password email',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/AuthForgotPasswordRequest',
                        },
                        example: {
                            email: 'john@example.com',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: AUTH_MESSAGE.FORGOT_PASSWORD_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthForgotPasswordSuccessResponse',
                            },
                        },
                    },
                },
                400: {
                    description: COMMON_MESSAGE.VALIDATION_FAILED,
                },
                404: {
                    description: AUTH_MESSAGE.USER_NOT_FOUND,
                },
            },
        },
    },
    '/auth/profile': {
        post: {
            tags: ['Auth'],
            summary: 'Update current user profile',
            security: bearerAuthSecurity,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/AuthUpdateProfileRequest',
                        },
                        example: {
                            name: 'John Doe',
                            bio: 'Building in public',
                            location: 'Ho Chi Minh City',
                            website: 'https://example.com',
                            avatar: 'https://cdn.example.com/avatar.png',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: AUTH_MESSAGE.UPDATE_USER_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthUpdateProfileSuccessResponse',
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
    '/auth/refresh-token': {
        post: {
            tags: ['Auth'],
            summary: 'Refresh token pair',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/AuthRefreshTokenRequest',
                        },
                        example: {
                            refreshToken: '14a39707c8cc5a8ea0421545e7f952171371586b1b4d98eb482e44c2b8d48884',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: AUTH_MESSAGE.REFRESH_TOKEN_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthTokenPairSuccessResponse',
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
    '/auth/me': {
        get: {
            tags: ['Auth'],
            summary: 'Get current authenticated user',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: AUTH_MESSAGE.GET_ME_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthMeSuccessResponse',
                            },
                        },
                    },
                },
                401: {
                    description: AUTH_MESSAGE.TOKEN_INVALID,
                },
                403: {
                    description: AUTH_MESSAGE.USER_BANNED,
                },
            },
        },
    },
    '/auth/logout': {
        post: {
            tags: ['Auth'],
            summary: 'Logout current session',
            security: bearerAuthSecurity,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/AuthLogoutRequest',
                        },
                        example: {
                            refreshToken: '14a39707c8cc5a8ea0421545e7f952171371586b1b4d98eb482e44c2b8d48884',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: AUTH_MESSAGE.LOGOUT_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthEmptySuccessResponse',
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
    '/auth/resend-verify-email': {
        post: {
            tags: ['Auth'],
            summary: 'Resend verify email to current user',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: AUTH_MESSAGE.RESEND_VERIFY_EMAIL_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthEmptySuccessResponse',
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
    '/auth/verify-email': {
        post: {
            tags: ['Auth'],
            summary: 'Verify email with token',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/AuthValidateTokenRequest',
                        },
                        example: {
                            token: 'f8c7f1b8d2a44c7c9f3f2a1b0c9d8e7f',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: AUTH_MESSAGE.VERIFY_EMAIL_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthEmptySuccessResponse',
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
    '/auth/validate/email': {
        post: {
            tags: ['Auth'],
            summary: 'Check whether an email is available',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/AuthValidateEmailRequest',
                        },
                        example: {
                            email: 'john@example.com',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: AUTH_MESSAGE.VALIDATE_EMAIL_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthValidateEmailSuccessResponse',
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
    '/auth/validate/username': {
        post: {
            tags: ['Auth'],
            summary: 'Check whether a username is available',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/AuthValidateUsernameRequest',
                        },
                        example: {
                            username: 'john_doe',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: AUTH_MESSAGE.VALIDATE_USERNAME_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthValidateUsernameSuccessResponse',
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
    '/auth/reset-password/validate': {
        get: {
            tags: ['Auth'],
            summary: 'Validate reset password token',
            parameters: [
                {
                    name: 'token',
                    in: 'query',
                    required: true,
                    schema: {
                        type: 'string',
                        example: 'f8c7f1b8d2a44c7c9f3f2a1b0c9d8e7f',
                    },
                    description: 'Reset password token',
                },
            ],
            responses: {
                200: {
                    description: AUTH_MESSAGE.VALIDATE_RESET_PASSWORD_TOKEN_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthValidateTokenSuccessResponse',
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
    '/auth/reset-password': {
        post: {
            tags: ['Auth'],
            summary: 'Reset password with token',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/AuthResetPasswordRequest',
                        },
                        example: {
                            token: 'f8c7f1b8d2a44c7c9f3f2a1b0c9d8e7f',
                            email: 'john@example.com',
                            password: 'Password123',
                            confirmPassword: 'Password123',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: AUTH_MESSAGE.RESET_PASSWORD_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthEmptySuccessResponse',
                            },
                        },
                    },
                },
                400: {
                    description: COMMON_MESSAGE.VALIDATION_FAILED,
                },
                404: {
                    description: COMMON_MESSAGE.RESOURCE_NOT_FOUND,
                },
            },
        },
    },
};