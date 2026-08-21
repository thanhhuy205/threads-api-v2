import type { PostType, Prisma, VisibilityPost } from '@prisma/client';
import type { CreatePostCommand } from '../command/create-post.command';
import type { UpdatePostDto } from '../dto/request';
import type { UserSnapshot } from '../mapper/post.mapper';

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');

export type PostRecord = {
  id?: number;
  publicId: string;
  content: string;
  contentJson?: Prisma.JsonValue;
  userId: string;
  type: PostType;
  visibility: VisibilityPost;
  isPinned?: boolean;
  dateRangeFrom?: Date | null;
  dateRangeTo?: Date | null;
  scheduledTimeFrom?: Date | null;
  scheduledTimeTo?: Date | null;
  groupTeamId?: number | null;
  createdAt: string;
};

export interface PostRepository {
  updateManyDecideStatus(postIds: number[], isDecline: boolean): Promise<any>;
  findManyInWeek(): Promise<any[]>;
  countOverviewDeclineByPostId(postIds: number[]): Promise<any[]>;
  findPostDecideWithinWeekByIds(postIds: number[]): Promise<any[]>;
  findAll(payload: any): Promise<any[]>;
  count(payload?: { where?: Prisma.PostWhereInput }): Promise<number>;
  countPostBydUserId(userId: string): Promise<number>;
  findCursorInfo(payload: { publicId: string; where?: Prisma.PostWhereInput }): Promise<any>;
  create(payload: CreatePostCommand & { type?: PostType }, userSnapshot: UserSnapshot, tx?: Prisma.TransactionClient): Promise<PostRecord>;
  createReply(payload: CreatePostCommand, data: any, tx?: Prisma.TransactionClient): Promise<PostRecord>;
  createRepost(payload: { userId: string; content?: string }, data: any, tx?: Prisma.TransactionClient): Promise<PostRecord>;
  createQuote(payload: CreatePostCommand, data: any, tx?: Prisma.TransactionClient): Promise<PostRecord>;
  list(): Promise<PostRecord[]>;
  findByPublicId(publicId: string, userId?: string | null): Promise<any>;
  countRepliesByPostPublicId(publicId: string): Promise<number>;
  findFirstRepliesByPostPublicId(count: number, publicId: string): Promise<any[]>;
  findLimitReplyInByPostIds(postIds: number[], limit: number): Promise<any[]>;
  findExisting(publicId: string): Promise<any>;
  findById(id: number): Promise<{ publicId: string } | null>;
  findByIds(ids: number[]): Promise<any[]>;
  findOriginReferenceByPublicId(publicId: string): Promise<any>;
  findDeleteTargetByPublicId(publicId: string): Promise<any>;
  updateByPublicId(publicId: string, payload: UpdatePostDto): Promise<PostRecord>;
  softDeleteByPublicId(publicId: string): Promise<void>;
  incrementLikedCount(publicId: string, count: number): Promise<{ likesCount: number; ownerId: string }>;
  searchByContent(payload: any): Promise<any[]>;
  applyLikeCountDelta(...args: any[]): Promise<any>;
  findLikeCountSnapshot(...args: any[]): Promise<any>;
  increaseLikeCount(publicId: string, count: number): Promise<void>;
  decreaseLikeCount(publicId: string, count: number): Promise<void>;
}
