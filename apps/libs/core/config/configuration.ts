import 'dotenv/config';

import { Logger } from '@nestjs/common';
import { Type } from 'class-transformer';
import type { ValidationError } from 'class-validator';
import { ValidateNested, validateSync } from 'class-validator';
import { AppConfiguration } from './app.config';
import { BaseConfiguration } from './base.config';
import { DatabaseConfiguration } from './database.config';
import { GroqConfiguration } from './groq.config';
import { JwtConfiguration } from './jwt.config';
import { LeonardoConfiguration } from './leonardo.config';
import { MongoConfiguration } from './mongodb.config';
import { NodemailerConfiguration } from './nodemailer.config';
import { OpenRouterConfiguration } from './openrouter.config';
import { PusherConfiguration } from './pusher.config';
import { R2Configuration } from './r2.config';
import { RedisConfiguration } from './redis.config';

export class Configuration extends BaseConfiguration {
  private readonly logger = new Logger(Configuration.name, { timestamp: true });

  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => DatabaseConfiguration)
  DATABASE_CONFIG = new DatabaseConfiguration();

  @ValidateNested()
  @Type(() => RedisConfiguration)
  REDIS_CONFIG = new RedisConfiguration();

  @ValidateNested()
  @Type(() => JwtConfiguration)
  JWT_CONFIG = new JwtConfiguration();

  @ValidateNested()
  @Type(() => NodemailerConfiguration)
  NODEMAILER_CONFIG = new NodemailerConfiguration();

  @ValidateNested()
  @Type(() => R2Configuration)
  R2_CONFIG = new R2Configuration();

  @ValidateNested()
  @Type(() => PusherConfiguration)
  PUSHER_CONFIG = new PusherConfiguration();

  @ValidateNested()
  @Type(() => OpenRouterConfiguration)
  OPENROUTER_CONFIG = new OpenRouterConfiguration();

  @ValidateNested()
  @Type(() => LeonardoConfiguration)
  LEONARDO_CONFIG = new LeonardoConfiguration();

  @ValidateNested()
  @Type(() => GroqConfiguration)
  GROQ_CONFIG = new GroqConfiguration();

  @ValidateNested()
  @Type(() => MongoConfiguration)
  MONGODB_CONFIG = new MongoConfiguration();

  validate(): this {
    const errors = validateSync(this, { validationError: { target: false } });
    if (errors.length > 0) {
      this.logger.error(`Invalid configuration fields: ${collectInvalidFields(errors).join(', ')}`);
      throw new Error('Configuration contains invalid or missing values');
    }
    return this;
  }
}

const collectInvalidFields = (errors: ValidationError[], parentPath = ''): string[] =>
  errors.flatMap((error) => {
    const path = parentPath ? `${parentPath}.${error.property}` : error.property;
    return error.children?.length ? collectInvalidFields(error.children, path) : [path];
  });

export const CONFIGURATION = new Configuration().validate();
export type TConfiguration = typeof CONFIGURATION;
export const configurationFactory = (): TConfiguration => CONFIGURATION;
