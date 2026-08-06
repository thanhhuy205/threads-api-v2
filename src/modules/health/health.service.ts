import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import env from '../../config/config';

@Injectable()
export class HealthService {
    constructor(private readonly prisma: PrismaService) { }

    buildHealthPayload() {
        return {
            service: 'threads-api-v2',
            status: 'ok',
            environment: env.NODE_ENV,
            timestamp: new Date().toISOString(),
        };
    }

    async checkDatabaseConnection() {
        await this.prisma.$queryRaw`SELECT 1`;

        return {
            database: 'connected',
        };
    }
}
