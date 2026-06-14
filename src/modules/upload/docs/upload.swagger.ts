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
    UploadMediaItemData: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
                example: 1,
            },
            key: {
                type: 'string',
                example: 'post-media/2026/05/uuid.webm',
            },
            url: {
                type: 'string',
                example: 'https://cdn.example.com/bucket/hls/video-id/index.m3u8',
            },
            type: {
                type: 'string',
                enum: ['IMAGE', 'VIDEO'],
                example: 'VIDEO',
            },
            status: {
                type: 'string',
                enum: ['UPLOADING', 'UPLOADED', 'FAILED', 'DELETED'],
                example: 'UPLOADING',
            },
            width: {
                type: ['integer', 'null'],
                example: null,
            },
            height: {
                type: ['integer', 'null'],
                example: null,
            },
        },
        required: ['id', 'key', 'url', 'type', 'status', 'width', 'height'],
    },
    UploadMediaData: {
        type: 'object',
        properties: {
            medias: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/UploadMediaItemData',
                },
            },
        },
        required: ['medias'],
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

const multipartMediaRequestBody = {
    required: true,
    content: {
        'multipart/form-data': {
            schema: {
                type: 'object',
                properties: {
                    medias: {
                        type: 'array',
                        description: 'One to five image or video files, maximum 20 MB per file',
                        items: {
                            type: 'string',
                            format: 'binary',
                        },
                        minItems: 1,
                        maxItems: 5,
                    },
                },
                required: ['medias'],
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
            requestBody: multipartMediaRequestBody,
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
                413: {
                    description: 'A media file exceeds the 20 MB upload limit',
                },
            },
        },
    },
};
