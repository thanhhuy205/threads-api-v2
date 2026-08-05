import { IsBoolean, IsInt, IsString, Min } from 'class-validator';
import { toBoolean } from './base.config';

export class PusherConfiguration {
  @IsString()
  PUSHER_APP_ID = process.env.PUSHER_APP_ID || 'app-id';

  @IsString()
  PUSHER_KEY = process.env.PUSHER_KEY || 'app-key';

  @IsString()
  PUSHER_SECRET = process.env.PUSHER_SECRET || 'app-secret';

  @IsString()
  PUSHER_HOST = process.env.PUSHER_HOST || 'localhost';

  @IsInt()
  @Min(1)
  PUSHER_PORT = process.env.PUSHER_PORT ? Number(process.env.PUSHER_PORT) : 6001;

  @IsBoolean()
  PUSHER_USE_TLS = toBoolean(process.env.PUSHER_USE_TLS);

  @IsString()
  PUSHER_CLUSTER = process.env.PUSHER_CLUSTER || '';
}
