import { IsBoolean, IsIn, IsNotEmpty, IsString } from 'class-validator';

export const toBoolean = (value: string | undefined, defaultValue = false): boolean => {
  if (value === undefined) return defaultValue;
  return ['true', '1', 'yes', 'on'].includes(value.trim().toLowerCase());
};

export class BaseConfiguration {
  @IsString()
  @IsIn(['development', 'test', 'production'])
  NODE_ENV: string;

  @IsBoolean()
  IS_DEV: boolean;

  @IsString()
  @IsNotEmpty()
  GLOBAL_PREFIX: string;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.IS_DEV = this.NODE_ENV === 'development';
    this.GLOBAL_PREFIX = process.env.GLOBAL_PREFIX || 'api/v1';
  }
}
