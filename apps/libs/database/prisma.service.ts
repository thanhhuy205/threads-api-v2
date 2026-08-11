import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { Prisma, PrismaClient } from '@prisma/client';

export type PrismaClientTransaction = Prisma.TransactionClient;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    console.log('Initializing PrismaService...');
    console.log(configService);
    const adapter = new PrismaMariaDb({
      host: configService.get<string>('DATABASE_CONFIG.DB_HOST'),
      port: configService.get<number>('DATABASE_CONFIG.DB_PORT'),
      user: configService.get<string>('DATABASE_CONFIG.DB_USER'),
      password: configService.get<string>('DATABASE_CONFIG.DB_PASSWORD'),
      database: configService.get<string>('DATABASE_CONFIG.DB_NAME'),
      connectionLimit: configService.get<number>('DATABASE_CONFIG.CONNECTION_LIMIT', 20),
      connectTimeout: configService.get<number>('DATABASE_CONFIG.CONNECTION_TIMEOUT', 5000),
      idleTimeout: configService.get<number>('DATABASE_CONFIG.IDLE_TIMEOUT', 300),
    });

    super({ adapter, log: ['error', 'warn'] });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
