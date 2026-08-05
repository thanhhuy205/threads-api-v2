import { IsInt, Min } from 'class-validator';

export class RateLimitConfiguration {
  @IsInt()
  @Min(1)
  RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS ? Number(process.env.RATE_LIMIT_WINDOW_MS) : 15 * 60 * 1000;

  @IsInt()
  @Min(1)
  RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX ? Number(process.env.RATE_LIMIT_MAX) : 100;
}
