import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class MongoConfiguration {
  @IsString()
  @IsNotEmpty()
  @Matches(/^mongodb(?:\+srv)?:\/\//, { message: 'MONGODB_URI must use mongodb:// or mongodb+srv://' })
  MONGODB_URI = process.env.MONGODB_URI || '';

  @IsString()
  @IsNotEmpty()
  MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || '';

  @IsString()
  @IsNotEmpty()
  MONGODB_USER = process.env.MONGODB_USER || '';

  @IsString()
  @IsNotEmpty()
  MONGODB_NAME = process.env.MONGODB_NAME || '';
}
