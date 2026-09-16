import { registerAs } from '@nestjs/config';

export * from './app.config';

const getRequiredEnvironmentVariable = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const getPositiveIntegerEnvironmentVariable = (name: string, defaultValue: number): number => {
  const value = Number(process.env[name] ?? defaultValue);

  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer`);
  }

  return value;
};

export const databaseConfiguration = registerAs('database', () => ({
  host: getRequiredEnvironmentVariable('DB_HOST'),
  port: getPositiveIntegerEnvironmentVariable('DB_PORT', 3306),
  user: getRequiredEnvironmentVariable('DB_USER'),
  password: getRequiredEnvironmentVariable('DB_PASSWORD'),
  database: getRequiredEnvironmentVariable('DB_NAME'),
  connectionLimit: getPositiveIntegerEnvironmentVariable('CONNECTION_LIMIT', 20),
  connectTimeout: getPositiveIntegerEnvironmentVariable('CONNECTION_TIMEOUT', 5000),
  idleTimeout: getPositiveIntegerEnvironmentVariable('IDLE_TIMEOUT', 300),
}));
