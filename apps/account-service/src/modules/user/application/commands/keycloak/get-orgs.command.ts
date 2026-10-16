import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetOrgsCommand {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  first = 0;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  max = 20;
}
