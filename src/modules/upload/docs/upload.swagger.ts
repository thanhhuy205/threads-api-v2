import { AUTH_MESSAGE, COMMON_MESSAGE, UPLOAD_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const uploadSwaggerSchemas = {
    UploadAvatarData: {
        type: 'object',
        properties: {
            key: {
                type: 'string',
                example: 'avatars/1714726800-avatar.jpg',
            },
            url: {
                type: 'string',
                example: 'https://cdn.example.com/bucket/avatars/1714726800-avatar.jpg',
            },
        },
        required: ['key', 'url'],
    },
    UploadAvatarSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: UPLOAD_MESSAGE.UPLOAD_AVATAR_SUCCESS,
            },
            data: {
                $ref: '#/components/schemas/UploadAvatarData',
            },
        },
        required: ['success', 'message', 'data'],
    },
    UploadMediaData: {
        type: 'object',
        properties: {
            urls: {
                type: 'array',
                items: {
                    type: 'string',
                    example: 'https://cdn.example.com/bucket/media/1714726800-media.jpg',
                },
            },
        },
        required: ['urls'],
    },
    UploadMediaSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: UPLOAD_MESSAGE.UPLOAD_MEDIA_SUCCESS,
            },
            data: {
                $ref: '#/components/schemas/UploadMediaData',
            },
        },
        required: ['success', 'message', 'data'],
    },
};

const multipartFileRequestBody = {
    required: true,
    content: {
        'multipart/form-data': {
            schema: {
                type: 'object',
                properties: {
                    file: {
                        type: 'string',
                        format: 'binary',
                    },
                },
                required: ['file'],
            },
        },
    },
};

export const uploadSwaggerPaths = {
    '/upload/avatar': {
        post: {
            tags: ['Upload'],
            summary: 'Upload avatar image',
            requestBody: multipartFileRequestBody,
            responses: {
                201: {
                    description: UPLOAD_MESSAGE.UPLOAD_AVATAR_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UploadAvatarSuccessResponse',
                            },
                        },
                    },
                },
                400: {
                    description: COMMON_MESSAGE.BAD_REQUEST,
                },
            },
        },
    },
    '/upload/media': {
        post: {
            tags: ['Upload'],
            summary: 'Upload post media',
            security: bearerAuthSecurity,
            requestBody: multipartFileRequestBody,
            responses: {
                201: {
                    description: UPLOAD_MESSAGE.UPLOAD_MEDIA_SUCCESS,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UploadMediaSuccessResponse',
                            },
                        },
                    },
                },
                400: {
                    description: COMMON_MESSAGE.BAD_REQUEST,
                },
                401: {
                    description: AUTH_MESSAGE.TOKEN_INVALID,
                },
            },
        },
    },
};
