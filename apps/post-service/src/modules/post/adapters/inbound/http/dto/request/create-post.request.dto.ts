import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDate, IsEnum, IsMilitaryTime, IsOptional, IsString, MaxLength, MinLength, ValidateIf, ValidateNested } from 'class-validator';
import { VisibilityPost } from '../../../../../../../generated/prisma/client';
import { creatablePostTypes } from '../../../../../constants/post-type';
import { PostMediaDto } from '../response/post-media.response.dto';
import { PostMentionDto } from '../response/post-mention.response.dto';

const normalizeEnum = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toUpperCase() : value;

export class CreatePostDto {
  @ApiPropertyOptional({ maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Content JSON must be at most 5000 characters' })
  contentJson?: string;

  @ApiProperty({ example: 'Hello Threads', maxLength: 5000 })
  @IsString()
  @MinLength(1, { message: 'Content must be at least 1 character' })
  @MaxLength(5000, { message: 'Content must be at most 5000 characters' })
  content!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @MinLength(1, { message: 'Topic must be at least 1 character' })
  @MaxLength(255, { message: 'Topic must be at most 255 characters' })
  topic?: string;

  @ApiPropertyOptional({ type: () => [PostMentionDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, { message: 'Mentions must be at most 5 users' })
  @ValidateNested({ each: true })
  @Type(() => PostMentionDto)
  mentions?: PostMentionDto[];

  @ApiPropertyOptional({ type: () => [PostMediaDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostMediaDto)
  media?: PostMediaDto[];

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isSurvey = false;

  @ApiPropertyOptional({ type: [String], maxItems: 4 })
  @ValidateIf((value: CreatePostDto) => value.isSurvey || value.polls !== undefined)
  @IsArray()
  @ArrayMinSize(2, { message: 'Polls must contain at least 2 options when isSurvey is true' })
  @ArrayMaxSize(4, { message: 'Polls must be at most 4 options' })
  @IsString({ each: true })
  @Transform(({ value }) => Array.isArray(value) ? value.map((item) => typeof item === 'string' ? item.trim() : item) : value)
  @MinLength(1, { each: true, message: 'Poll option text is required' })
  @MaxLength(255, { each: true, message: 'Poll option text must be at most 255 characters' })
  polls?: string[];

  @ApiPropertyOptional({ enum: creatablePostTypes })
  @IsOptional()
  @Transform(normalizeEnum)
  @IsEnum(creatablePostTypes)
  type?: (typeof creatablePostTypes)[number];


  @ApiPropertyOptional({ default: 'EVERYONE' })
  @IsOptional()
  @Transform(normalizeEnum)
  @IsEnum(['EVERYONE', 'FOLLOWERS', 'MENTIONED'], { message: 'Invalid replyPermission value' })
  replyPermission?: string = 'EVERYONE';


  @ApiPropertyOptional({ default: 'WORKSPACE' })
  @IsOptional()
  @Transform(normalizeEnum)
  @IsEnum(VisibilityPost, { message: 'Invalid visibility value' })
  visibility?: VisibilityPost = VisibilityPost.WORKSPACE;

  @ApiPropertyOptional({ description: 'Public ID of the target group' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  groupPublicId?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean = false;


  @ApiPropertyOptional({ type: Date, nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateRangeFrom?: Date | null;


  @ApiPropertyOptional({ type: Date, nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateRangeTo?: Date | null;


  @ApiPropertyOptional({
    type: String,
    example: '09:00',
    nullable: true,
  })
  @IsOptional()
  @IsMilitaryTime()
  scheduledTimeFrom?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: '17:30',
    nullable: true,
  })
  @IsOptional()
  @IsMilitaryTime()
  scheduledTimeTo?: string | null;
}
