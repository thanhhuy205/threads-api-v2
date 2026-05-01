import env from '../config/env';
import prisma from '../config/prisma';
import createApp from './app';

const app = createApp();

const server = app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});

const shutdown = (signal: string) => {
    console.log(`Received ${signal}. Closing server...`);

    server.close((error) => {
        if (error) {
            console.error('Error while closing server', error);
            process.exit(1);
            return;
        }

        void prisma.$disconnect().finally(() => {
            process.exit(0);
        });
    });
};

process.on('SIGINT', () => {
    shutdown('SIGINT');
});

process.on('SIGTERM', () => {
    shutdown('SIGTERM');
});