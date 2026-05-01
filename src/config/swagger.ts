
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
    jwtSwaggerSchemas,
} from '../modules/jwt/docs/jwt.swagger';

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
    ],

    paths: {
        ...healthSwaggerPaths,
        ...authSwaggerPaths,
        ...postSwaggerPaths,
    },

    components: {
        schemas: {
            ...healthSwaggerSchemas,
            ...authSwaggerSchemas,
            ...postSwaggerSchemas,
            ...jwtSwaggerSchemas,
        },

        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};

