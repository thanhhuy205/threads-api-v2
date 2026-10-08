import type { PostType } from '@purse/common/enums';
import type { Prisma } from '../../../../../../generated/prisma/client';
import type { CreatePostCommand } from '../../../commands/create-post.command';
import type { UpdatePostCommand } from '../../../commands/update-post.command';
import type { PostRecord, UserSnapshot } from '../../../result';

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');

export interface PostRepositoryPort {
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
  findExisting(publicId: string): Promise<any>;
  findById(id: number): Promise<{ publicId: string } | null>;
  findByIds(ids: number[]): Promise<any[]>;
  findOriginReferenceByPublicId(publicId: string): Promise<any>;
  findDeleteTargetByPublicId(publicId: string): Promise<any>;
  updateByPublicId(publicId: string, payload: UpdatePostCommand): Promise<PostRecord>;
  softDeleteByPublicId(publicId: string): Promise<void>;
  incrementLikedCount(publicId: string, count: number): Promise<{ likesCount: number; ownerId: string }>;
  searchByContent(payload: any): Promise<any[]>;
  applyLikeCountDelta(...args: any[]): Promise<any>;
  findLikeCountSnapshot(...args: any[]): Promise<any>;
  increaseLikeCount(publicId: string, count: number): Promise<void>;
  decreaseLikeCount(publicId: string, count: number): Promise<void>;
}
