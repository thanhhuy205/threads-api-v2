import { pineProducer } from '@/modules/job/pine-vector/producer/pine.producer';
import { NewFeedType } from '@/modules/post/enum';
import { buildNewFeedWhere, buildUserPostsWhere } from '@/modules/post/helper';
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

type GetPostWithPostId = {
    currentPage: number;
    perPage: number;
    postId: number;
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
            pagination: {
                currentPage,
                perPage,
                total,
                rowCount: posts.length
            }
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
        postId,
    }: GetPostWithPostId) {
        return this.paginatePosts({
            currentPage,
            perPage,
            where: {
                parentId: postId,
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

    async create(payload: CreatePostPayload): Promise<PostRecord> {
        await pineProducer.addToPineconeQueue({ content: payload.content, topic: ['not'] });
        return postRepository.create(payload);
    }

    async list(): Promise<PostRecord[]> {
        return postRepository.list();
    }
}

export const postService = new PostService();
