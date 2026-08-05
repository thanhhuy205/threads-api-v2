import { IsNotEmpty, IsString } from 'class-validator';

export class OpenRouterConfiguration {
  @IsString()
  @IsNotEmpty()
  OPEN_ROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY || '';
}
