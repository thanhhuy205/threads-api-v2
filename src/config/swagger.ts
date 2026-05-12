import {
    authSwaggerPaths,
    authSwaggerSchemas,
} from '../modules/auth/docs/auth.swagger';

import {
    healthSwaggerPaths,
    healthSwaggerSchemas,
} from '../modules/health/docs/health.swagger';

import {
    postSwaggerPaths,
    postSwaggerSchemas,
} from '../modules/post/docs/post.swagger';

import {
    userSwaggerPaths,
    userSwaggerSchemas,
} from '../modules/user/docs/user.swagger';

import {
    uploadSwaggerPaths,
    uploadSwaggerSchemas,
} from '../modules/upload/docs/upload.swagger';

import {
    circleSwaggerPaths,
    circleSwaggerSchemas,
} from '../modules/circle/docs/circle.swagger';
import {
    jwtSwaggerSchemas,
} from '../modules/jwt/docs/jwt.swagger';
import {
    notificationSwaggerPaths,
    notificationSwaggerSchemas,
} from '../modules/notification/docs/notification.swagger';
import {
    adminSwaggerPaths,
    adminSwaggerSchemas,
} from '../modules/admin/docs/admin.swagger';

export const swaggerDocument = {
    openapi: '3.0.0',

    info: {
        title: 'Threads API',
        version: '1.0.0',
        description: 'API documentation for Threads API',
    },

    servers: [
        {
            url: 'http://localhost:3302/api/v1',
            description: 'Local server',
        },
    ],

    tags: [
        {
            name: 'Health',
            description: 'Health check APIs',
        },
        {
            name: 'Auth',
            description: 'Authentication APIs',
        },
        {
            name: 'Post',
            description: 'Post APIs',
        },
        {
            name: 'User',
            description: 'User and social APIs',
        },
        {
            name: 'Upload',
            description: 'Upload APIs',
        },
        {
            name: 'Circle',
            description: 'Circle / community APIs',
        },
        {
            name: 'Notification',
            description: 'Notification APIs',
        },
        {
            name: 'Admin',
            description: 'Admin APIs',
        },
    ],

    paths: {
        ...healthSwaggerPaths,
        ...authSwaggerPaths,
        ...postSwaggerPaths,
        ...userSwaggerPaths,
        ...uploadSwaggerPaths,
        ...circleSwaggerPaths,
        ...notificationSwaggerPaths,
        ...adminSwaggerPaths,
    },

    components: {
        schemas: {
            ...healthSwaggerSchemas,
            ...authSwaggerSchemas,
            ...postSwaggerSchemas,
            ...userSwaggerSchemas,
            ...uploadSwaggerSchemas,
            ...circleSwaggerSchemas,
            ...notificationSwaggerSchemas,
            ...jwtSwaggerSchemas,
            ...adminSwaggerSchemas,
        },

        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },

    security: [
        {
            bearerAuth: [],
        },
    ],
};
