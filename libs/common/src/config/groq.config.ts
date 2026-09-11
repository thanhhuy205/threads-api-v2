import { IsNotEmpty, IsString } from 'class-validator';

export class GroqConfiguration {
  @IsString()
  @IsNotEmpty()
  GROQ_API_KEY = process.env.GROQ_API_KEY || '';
}
