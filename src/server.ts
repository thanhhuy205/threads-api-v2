import app from '@/app';
import configService from './config/config';
import prisma from './config/prisma';


const server = app.listen(configService.PORT, () => {
    console.log(`Server is running on http://localhost:${configService.PORT}`);
});

const shutdown = (signal: string) => {
    console.log(`Received ${signal}. Closing server...`);

    server.close((error) => {
        if (error) {
            process.exit(1);
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