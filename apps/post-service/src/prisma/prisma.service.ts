import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { databaseConfiguration } from '../config';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(databaseConfiguration.KEY)
    databaseConfig: ConfigType<typeof databaseConfiguration>,
  ) {
    const adapter = new PrismaMariaDb({
      host: databaseConfig.host,
      port: databaseConfig.port,
      user: databaseConfig.user,
      password: databaseConfig.password,
      database: databaseConfig.database,
      connectionLimit: databaseConfig.connectionLimit,
      connectTimeout: databaseConfig.connectTimeout,
      idleTimeout: databaseConfig.idleTimeout,
    });
    super({ adapter, log: ['error', 'warn'] });
  }

  async onModuleInit(): Promise<void> { await this.$connect(); }
  async onModuleDestroy(): Promise<void> { await this.$disconnect(); }
}
