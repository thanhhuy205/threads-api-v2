import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class R2Configuration {
  @IsUrl({ require_tld: false })
  R2_ENDPOINT = process.env.R2_ENDPOINT || '';

  @IsString()
  @IsNotEmpty()
  R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';

  @IsString()
  @IsNotEmpty()
  R2_TOKEN_VALUE = process.env.R2_TOKEN_VALUE || '';

  @IsString()
  @IsNotEmpty()
  R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';

  @IsString()
  @IsNotEmpty()
  R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';

  @IsString()
  @IsNotEmpty()
  R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';

  @IsUrl({ require_tld: false })
  S3_ENDPOINT = process.env.S3_ENDPOINT || '';
}
