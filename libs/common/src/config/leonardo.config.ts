import { IsNotEmpty, IsString } from 'class-validator';

export class LeonardoConfiguration {
  @IsString()
  @IsNotEmpty()
  LEONARDO_API_KEY = process.env.LEONARDO_API_KEY || '';
}
