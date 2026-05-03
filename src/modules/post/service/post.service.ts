import { pineProducer } from '@/modules/job/pine-vector/producer/pine.producer';
import { mixedBreadService } from '@/modules/mixed-bread/service/mixed-bread.service';
import { pineconeService } from '@/modules/pinecone/service/pinecone.service';
import { NewFeedType } from '@/modules/post/enum';
import { buildNewFeedWhere, buildUserPostsWhere } from '@/modules/post/helper';
import { userService } from '@/modules/user/service/user.service';
import { buildPaginationResponse } from '@/shared/pagination/pagination';
import { PostType, Prisma } from '@prisma/client';
import { CreatePostDto } from '../dto/post.dto';
import { PostRecord, postRepository } from '../repository/post.repository';

type NewsFeedPayload = {
    currentPage: number;
    perPage: number;
    userId: string | null;
    feedType?: NewFeedType;
};

type GetPostWithUser = {
    currentPage: number;
    perPage: number;
    userId: string;
};

type GetPostWithPublicId = {
    currentPage: number;
    perPage: number;
    publicId: string;
};

type CreatePostPayload = CreatePostDto & {
    userId: string;
};

class PostService {
    private async paginatePosts({
        currentPage,
        perPage,
        where,
    }: {
        currentPage: number;
        perPage: number;
        where: Prisma.PostWhereInput;
    }) {
        const [posts, total] = await Promise.all([
            postRepository.findAll({
                page: currentPage,
                limit: perPage,
                where,
            }),
            postRepository.count({ where })
        ]);

        return {
            posts,
            pagination: buildPaginationResponse(total, currentPage, perPage),
        }
    }

    async getNewsFeed({
        currentPage,
        perPage,
        userId,
        feedType = NewFeedType.FOR_YOU,
    }: NewsFeedPayload) {
        const where = buildNewFeedWhere(userId, feedType);

        return this.paginatePosts({
            currentPage,
            perPage,
            where,
        });
    }


    async getPostMe({
        currentPage,
        perPage,
        userId,
    }: GetPostWithUser) {
        return this.paginatePosts({
            currentPage,
            perPage,
            where: buildUserPostsWhere({
                userId,
                postType: PostType.POST
            }),
        });
    }


    async getReplies({
        currentPage,
        perPage,
        publicId,
    }: GetPostWithPublicId) {

        return this.paginatePosts({
            currentPage,
            perPage,
            where: {
                parentPublicId: publicId,
                type: PostType.REPLY
            },
        });
    }


    async getRepost({
        currentPage,
        perPage,
        userId,
    }: GetPostWithUser) {
        return this.paginatePosts({
            currentPage,
            perPage,
            where: buildUserPostsWhere({
                userId,
                postType: PostType.REPOST
            }),
        });
    }


    async getQuote({
        currentPage,
        perPage,
        userId,
    }: GetPostWithUser) {
        return this.paginatePosts({
            currentPage,
            perPage,
            where: buildUserPostsWhere({
                userId,
                postType: PostType.QUOTE
            }),
        });
    }

    async create(payload: CreatePostPayload) {
        const userSnapshot = await userService.findByUserId(payload.userId);

        if (!userSnapshot) {
            throw new Error('User not found');
        }

        const post = await postRepository.create(payload, {
            id: userSnapshot.id,
            username: userSnapshot.username,
            bio: userSnapshot.bio,
            avatar: userSnapshot.avatar,
            followersCount: userSnapshot.followersCount,
        });
        await pineProducer.addToPineconeQueue({ content: payload.content, topic: ['not'], postId: post.id || 0, userId: payload.userId });
        return post;
    }

    async list(): Promise<PostRecord[]> {
        return postRepository.list();
    }

    async search(query: {
        q: string;
        topics: string;
        limit: string;
        page: string;
    }): Promise<any[]> {
        const { q, topics, limit, page } = query;
        const embedding = await mixedBreadService.generateEmbedding(q, topics.split(','));
        const results = await pineconeService.querySimilarPosts(embedding, Number(limit) || 10);

        return results;
    }

    async getById(publicId: string) {
        // Minimal stub: return a placeholder post object
        return {
            publicId,
            content: '',
            userId: '',
            createdAt: new Date().toISOString(),
        } as PostRecord;
    }



    async reply(publicId: string, payload: CreatePostDto & { userId: string }) {
        const userSnapshot = await userService.findByUserId(payload.userId);

        if (!userSnapshot) {
            throw new Error('User not found');
        }

        const post = await postRepository.createReply({
            content: payload.content,
            userId: payload.userId,
        }, publicId, userSnapshot);

        return {
            publicId: post.publicId,
            content: post.content!,
            userId: post.userId,
            createdAt: post.createdAt,
        } as PostRecord;
    }


    async repost(payload: CreatePostDto & { publicId: string }, userId: string) {
        const userSnapshot = await userService.findByUserId(userId);

        if (!userSnapshot) {
            throw new Error('User not found');
        }

        const post = await postRepository.createRepost({
            userId,
            content: payload.content
        }, payload.publicId, userSnapshot);

        return {
            publicId: post.publicId,
            userId: post.userId,
            createdAt: post.createdAt,
        } as PostRecord;

    }

    async quote(publicId: string, payload: CreatePostDto & { userId: string }) {
        const userSnapshot = await userService.findByUserId(payload.userId);

        if (!userSnapshot) {
            throw new Error('User not found');
        }
        const post = await postRepository.createQuote({
            userId: payload.userId,
            content: payload.content
        }, publicId, userSnapshot);


        return {
            publicId: post.publicId,
            content: post.content,
            userId: payload.userId,
            createdAt: new Date().toISOString(),
        } as PostRecord;
    }

    async save(publicId: string, userId: string): Promise<void> {
        // stub: no-op
        return;
    }

    async hide(publicId: string, userId: string): Promise<void> {
        const post = await postRepository.findByPublicId(publicId);
        if (!post) {
            throw new Error('Post not found');
        }

        if (post.userId === userId) {
            throw new Error('Users cannot hide their own posts');
        }

        await postRepository.updateIsGhost(publicId, !post.isGhost);
    }

    async like(publicId: string, userId: string): Promise<void> {
        // stub: no-op
        return;
    }


    async delete(publicId: string, userId: string): Promise<void> {
        // stub: no-op
        return;
    }

    async report(publicId: string, payload: { reason: string; userId: string }): Promise<void> {
        // stub: no-op
        return;
    }
}

export const postService = new PostService();
